import ScreenWrapper from '@/components/ScreenWrapper';
import { firestore } from '@/config/firebase';
import { colors } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { scale, verticalScale } from '@/utils/styling';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Platform,
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
      text: 'Hey! I can help you understand your spending, save for goals, and budget smarter. Ask me anything!',
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
${userSummary}

User's question: ${newUserMsg.text}
You are a helpful financial assistant. You are talking to a older teenager / adolescent who is learning to manage their money. Maybe throw a joke in here and there. Maintain authority but don't be cold/distant.
Provide clear, CONCISE, and friendly advice based on the user's financial data above. If you don't have enough information, ask relevant questions to gather more details.
Don't ramble or make up information. Keep focus on budgeting, saving, and spending habits.
Respond in a way that is easy to understand and actionable. 
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
    <ScreenWrapper>
      <View
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
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
            <Markdown>{msg.text}</Markdown>
          </Animated.View>
        ))}
      </ScrollView>
      {loading && (
        <Animated.Text
          entering={SlideInUp}
          exiting={SlideOutDown}
          style={{ textAlign: 'center', fontSize: 18, marginBottom: 8, color: '#888' }}
        >
          ...
        </Animated.Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your finances..."
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} disabled={loading} />
      </View>
    </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(20),
    backgroundColor: colors.neutral900,
  },
  messages: {
    padding: 16,
    paddingBottom: 100,
  },
  message: {
    marginBottom: 12,
    padding: scale(10),
    borderRadius: 12,
    // width: 'fit-content',
    maxWidth: '85%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
});