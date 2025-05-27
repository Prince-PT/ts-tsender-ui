
# ts-tsender-ui 🎯

A modern, TypeScript-based frontend UI for interacting with **ts-sender**, a transaction sender utility. Built using **Next.js**, **Tailwind CSS**, and **TypeScript**, this project aims to provide a clean and developer-friendly interface for testing and sending Ethereum transactions via a smart contract or backend service.

## ✨ Features

- ⚡ TypeScript-powered React components
- 💅 Styled with Tailwind CSS for rapid UI development
- 📦 Modular structure for easy maintainability
- 🔐 Connect your wallet using MetaMask or other EVM-compatible providers
- 📤 Send and track Ethereum transactions from the UI

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ethers.js](https://docs.ethers.org/)
- [RainbowKit](https://www.rainbowkit.com/) + [Wagmi](https://wagmi.sh/) (optional, if used)

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Prince-PT/ts-tsender-ui.git
cd ts-tsender-ui
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser to view the app.

## 📁 Project Structure

```
ts-tsender-ui/
│
├── components/         # Reusable UI components
├── pages/              # Next.js pages (routes)
├── public/             # Static assets
├── styles/             # Tailwind CSS setup
├── utils/              # Helper functions or configs
├── tsconfig.json       # TypeScript config
└── next.config.js      # Next.js config
```

## ⚙️ Environment Variables

Create a `.env.local` file to store environment variables:

```
NEXT_PUBLIC_RPC_URL=<your_rpc_url>
NEXT_PUBLIC_CONTRACT_ADDRESS=<contract_address>
```

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform that supports Next.js.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Made with 💚 by [Prince Thakkar](https://www.linkedin.com/in/prince-thakkar-8294b5230/)

```

---

Let me know if you'd like a [logo badge](f), [demo section](f), or [contribution guidelines](f) added.
```
