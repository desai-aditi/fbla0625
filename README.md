# 🏦 Fiscus – Financial Literacy, Reimagined for Gen Z

Fiscus is a **mobile-first financial management app** built specifically for students.  
It empowers teens to take control of their money through visual insights, real-time tracking, and AI-powered advice.

---

## ⚙️ Tech Stack

| Tech                | Purpose                                  |
|---------------------|------------------------------------------|
| `React Native` + `Expo` | Cross-platform mobile development       |
| `TypeScript`        | Strong typing and safer code             |
| `Firebase`          | Auth, Firestore DB, real-time sync       |
| `Google Gemini API` | Personalized AI chat responses           |

---

## 📌 Why Fiscus?

- 💸 **22% of U.S. teens lack basic financial literacy**
- 🧾 Teenagers are surrounded by invisible money: Apple Pay, Venmo, credit cards
- 🧠 Schools rarely teach how to manage real-life spending

Fiscus exists to **make money visible again**, helping teens build lifelong financial skills.

---

## 📲 Features

### 🔐 Authentication
- Secure sign-up and login using Firebase Auth
- All data is tied to a unique user and synced in real-time

### 🏠 Home Dashboard
- Shows balance, income, expenses
- Savings rate percentage
- 📊 Bar chart (income vs. expenses by time)
- 🥧 Pie chart (spending by category)

### 📒 Ledger
- View all transactions grouped by date
- Edit, delete, and search by keyword or category
- Filter view for category-specific insights

### ➕ Add Transaction
- Simple 3-field input (amount, date, category)
- Input validation prevents future-dated or $0 entries
- Fast and frictionless UX

### 💬 AI Chat (Google Gemini)
- Ask personalized finance questions like:
  - _“How can I save more this month?”_
  - _“What am I spending too much on?”_
- AI assistant uses YOUR data—not generic advice

### 👤 Profile
- Edit name, profile photo
- Secure logout

---

## 🎨 Design Highlights

- **Mobile-first** design tailored for Gen Z habits
- **Clean, calming UI** to reduce financial anxiety and increase usability
- **Color palette** inspired by blues and greens for trust and clarity
- **User-tested wireframes** iterated based on feedback from real teen users

---

## 🛠️ Run Locally

To run the Fiscus app on your local machine:

```bash
git clone https://github.com/your-username/fiscus.git
cd fiscus
npm install
npx expo start
```
