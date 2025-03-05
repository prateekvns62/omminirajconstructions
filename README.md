# Omminiraj Constructions - Next.js Project

## 🚀 Project Setup

### Clone the Repository
```sh
git clone https://github.com/prateekvns62/omminirajconstructions.git
cd omminirajconstructions
```

### Install Dependencies
Using npm:
```sh
npm install
```

### Create Environment File
Create a `.env.local` file in the root directory and add necessary environment variables.
```sh
touch .env.local
```

### Run the Development Server
```sh
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build and Start in Production Mode
```sh
npm run build
npm run start
```

## 📁 Project Structure
```
📦 omminirajconstructions
├── 📂 pages         # Next.js pages
├── 📂 components    # Reusable components
├── 📂 public        # Static assets
├── 📂 styles        # Global styles
├── .env.local       # Environment variables
├── package.json     # Dependencies and scripts
└── README.md        # Project documentation
```

## 🚀 Deployment
For production deployment, you can use:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Docker**
- **Self-hosting**

### Deploy on Vercel
```sh
npm i -g vercel
vercel
```

## 🔄 Post-Pull Instructions
After pulling the latest changes from the repository, always run:
```sh
npm install
```

Update the `.env.local` file with your MySQL credentials:
```sh
DATABASE_URL="mysql://db_username:yourpassword@localhost:3306/db_name"
```

Then, apply database migrations:
```sh
npx prisma migrate dev --name init
npx prisma generate
```

## 🤝 Contributing
Feel free to fork the repository and make pull requests. For major changes, please open an issue first.

## 📜 License
This project is licensed under the MIT License.
