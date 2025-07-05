import ScreenWrapper from '@/components/ScreenWrapper';
import { firestore } from '@/config/firebase';
import { colors, radius, shadows, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { scale, verticalScale } from '@/utils/styling';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeOut, Layout, SlideInLeft, SlideInRight, SlideInUp, SlideOutDown } from 'react-native-reanimated';

const genAI = new GoogleGenerativeAI('AIzaSyC0YXx41Yy6CJqVc3wnMqoVffBzLfsZbi4');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'Hey! I can help you understand your spending, save for goals, and budget smarter. Ask me anything! 💰',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [userSummary, setUserSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) fetchUserSummary(user.uid);
  }, [user]);

  const fetchUserSummary = async (uid: string) => {
    try {
      const q = query(collection(firestore, 'transactions'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      const transactions = snapshot.docs.map(doc => doc.data());

      let income = 0;
      let expenses = 0;
      let categoryTotals: Record<string, number> = {};
      let expenseCategoryTotals: Record<string, number> = {};

      for (let tx of transactions) {
        const amount = parseFloat(tx.amount);
        const category = tx.category;

        if (tx.type === 'income') {
          income += amount;
        } else {
          expenses += amount;
          expenseCategoryTotals[category] = (expenseCategoryTotals[category] || 0) + amount;
        }
      }

      const biggestExpense = Object.entries(expenseCategoryTotals)
        .sort((a, b) => b[1] - a[1])[0];

      const summary = `
User Summary:
- Total income: $${income.toFixed(2)}
- Total expenses: $${expenses.toFixed(2)}
- Biggest expense category: ${biggestExpense?.[0] || 'N/A'} ($${biggestExpense?.[1].toFixed(2) || 0})
- Savings rate: ${((income - expenses) / income * 100).toFixed(1)}%
- Expense category breakdown: ${Object.entries(expenseCategoryTotals).map(([k, v]) => `${k}: $${v.toFixed(2)}`).join(', ')}
`;
      setUserSummary(summary);
    } catch (e) {
      console.error('Error fetching summary:', e);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
    };

    const loadingMsg: ChatMessage = {
      id: Date.now() + 0.5,
      text: '*FinanceBot is typing...*',
      sender: 'bot',
    };

    setMessages(prev => [...prev, newUserMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    const prompt = `
THIS IS THE USER'S SUMMARY: ${userSummary}
You are a helpful financial assistant. You are talking to a older teenager / adolescent who is learning to manage their money. Maybe throw a joke in here and there ONLY IF IT FITS THE CONVO. Maintain authority but don't be cold/distant.
Provide clear, CONCISE, and friendly advice based on the user's financial data above. If you don't have enough information, ask relevant questions to gather more details.
Don't ramble or make up information. Keep focus on budgeting, saving, and spending habits.
Respond in a way that is easy to understand and actionable. DO NOT SEND MESSAGES THAT ARE UNNECESSARILY LONG.
User's question: ${newUserMsg.text}
`;

    try {
      const result = await model.generateContent(prompt);
      const botReply = result.response.text().trim();

      const newBotMsg: ChatMessage = {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot',
      };

      setMessages(prev =>
        prev
          .filter(msg => msg.text !== '*FinanceBot is typing...*')
          .concat(newBotMsg)
      );
    } catch (err) {
      console.error('Gemini error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper barStyle='dark-content' style={{backgroundColor: colors.surfaceBg}}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <FontAwesome5 name="robot" size={24} color={colors.primary} />
            <Animated.Text style={styles.headerTitle}>FinanceBot</Animated.Text>
            <View style={styles.statusIndicator} />
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          contentContainerStyle={styles.messages} 
          showsVerticalScrollIndicator={false}
          style={styles.messagesContainer}
        >
          {messages.map(msg => (
            <Animated.View
              key={msg.id}
              entering={msg.sender === 'user' ? SlideInRight.delay(50) : SlideInLeft.delay(300)}
              exiting={FadeOut}
              layout={Layout}
              style={[
                styles.message,
                msg.sender === 'user' ? styles.userMsg : styles.botMsg,
              ]}
            >
              <Markdown
                style={{
                  body: [
                    msg.sender === 'user' ? styles.messageText : styles.botText
                  ]
                }}
              >
                {msg.text}
              </Markdown>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Typing indicator */}
        {loading && (
          <Animated.View
            entering={SlideInUp}
            exiting={SlideOutDown}
            style={styles.typingIndicator}
          >
            <ActivityIndicator size="small" color={colors.primary} />
            <Animated.Text style={styles.typingText}>
              FinanceBot is thinking...
            </Animated.Text>
          </Animated.View>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your finances..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
              maxLength={500}
            />
            <Animated.View
              style={[
                styles.sendButton,
                { backgroundColor: input.trim() ? colors.primary : colors.neutral300 }
              ]}
            >
              <FontAwesome5 
                name="paper-plane" 
                size={18} 
                color={input.trim() ? colors.white : colors.textMuted}
                onPress={handleSend}
                disabled={loading || !input.trim()}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
    paddingTop: spacingY._20
  },
  header: {
    backgroundColor: colors.cardBg,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(15),
    paddingHorizontal: spacingX._20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    ...shadows.small,
    borderRadius: radius._10
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
  },
  headerTitle: {
    fontSize: verticalScale(20),
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  statusIndicator: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.success,
  },
  messagesContainer: {
    flex: 1,
  },
  messages: {
    paddingVertical: spacingX._16,
    gap: spacingY._10,
  },
  message: {
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._16,
    borderRadius: radius._20,
    maxWidth: '85%',
    ...shadows.small,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius._8,
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBg,
    borderBottomLeftRadius: radius._8,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  messageText: {
    color: colors.white,
    fontSize: verticalScale(15),
    lineHeight: verticalScale(20),
    fontWeight: '500',
  },
  botText: {
    color: colors.text,
    fontSize: verticalScale(15),
    lineHeight: verticalScale(20),
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._10,
    gap: spacingX._8,
  },
  typingText: {
    color: colors.textMuted,
    fontSize: verticalScale(14),
    fontStyle: 'italic',
  },
  inputContainer: {
    alignItems: 'center',
    paddingTop: spacingY._20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: radius._24,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._8,
    gap: spacingX._12,
    minHeight: verticalScale(48),
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: verticalScale(16),
    lineHeight: verticalScale(22),
    maxHeight: verticalScale(120),
    paddingVertical: spacingY._8,
  },
  sendButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY._2,
  },
});