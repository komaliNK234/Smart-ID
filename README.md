# 🎓 CampusID — Digital College ID Management System

> **Apply • Verify • Pay • Generate**  
> An enterprise-grade, end-to-end Digital Identity, Status Change Clearance, Fee Calculation, and Payment Verification Platform for Universities and Higher Education Institutions.

---

## 🌟 Features & Business Logic Overview

### 1. Smart Student-Based ID Rules (Option A)
- **🟢 College Hostel Resident**:
  - Automatically receives **Vertical Orientation**.
  - Vibrant **Green border and collegiate header**.
  - Displays **`🟢 HOSTELLER ID`** and **`College Hostel Resident`** badges with Hall clearance.
- **🔵 College Bus / Day Scholar**:
  - Automatically receives **Horizontal Orientation**.
  - Professional **Blue border and header branding**.
  - Displays **`🔵 DAY SCHOLAR ID`** badge with bus route/stop metadata.
- **🏢 Outside Hostel / PG**:
  - Automatically receives **Horizontal Orientation** with **`🔵 DAY SCHOLAR ID`** format.

### 2. Status Change Detection & Clearance Enforcements
- **College Hostel &rarr; Outside Hostel / PG**:
  - System automatically flags:  
    `⚠️ Status Change Detected: Your previous status was College Hostel. Additional verification is required before issuing a Day Scholar ID.`
  - Mandatory Document: **📄 Vacated College Hostel Form** (signed by Chief Warden).
  - Supporting Document: **📄 Outside Accommodation Proof** (PG rental agreement or fee receipt).
- **College Hostel &rarr; College Bus / Day Scholar**:
  - Mandatory Documents: **📄 Vacated College Hostel Form** AND **🚌 Bus Registration / Bus Fee Proof**.
  - Both documents must be submitted and approved before fee payment is enabled.

### 3. Common ID Policy (Option B)
- Single universal card template across all students without residency distinction.
- Flexible choice between **Horizontal Common ID** and **Vertical Common ID**.
- Bypasses accommodation clearance while collecting complete academic, personal, and blood group details.

### 4. Verification Workflow (Admin Panel)
- State transitions: `🟡 Pending Verification` &rarr; `🟢 Verified` or `🔴 Rejected`.
- Reason specification on rejection so students can re-upload corrections.
- **Strict Verification Rule**: ID cards are **never generated** while clearance documents are pending or rejected.

### 5. Configurable Fee Structure & Authoritative Backend Calculation
- Dynamic fee configuration:
  - **New ID**: ₹100
  - **Renewal**: ₹75
  - **Replacement**: ₹150
  - **Status Change ID**: ₹100
  - **Portal Processing Fee**: ₹10
- Admin can modify fee rates directly through the Administrative Settings modal.
- Amounts are securely computed and validated by the Node.js backend.

### 6. Real Online Payment Integration (Razorpay Test Mode)
- Secure order generation via `/api/payment/create-order`.
- Real Razorpay Checkout modal with pre-filled student details.
- Server-side cryptographic signature verification using SHA-256 HMAC (`/api/payment/verify-payment`).
- Built-in Sandbox simulator for instant zero-config testing if keys are not yet configured.

### 7. Interactive Digital ID Card & Client-Side Export
- **Dynamic QR Code**: Live-encodes Student ID, Name, Department, Course, Academic Year, and Card Type.
- **3D Flip Card Animation**: Seamless perspective flip between Front and Back.
- **Front Face**: High-resolution student photo, university crest, roll number, department, year, blood group, emergency contact, validity date.
- **Back Face**: Campus physical address, Registrar desk, official Dean signature, barcode, and "If found return" instructions.
- **Export Options**:
  - **Download ID Card**: Client-side high-DPI export to CR-80 card PDF (`html2canvas` + `jsPDF`).
  - **Print ID Card**: Clean printer-optimized layout triggering browser print dialog.
  - **Download Receipt**: Printable tax invoice and university payment receipt.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS (Design System Tokens), Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, Cors, Dotenv, Crypto (HMAC SHA-256) |
| **Database** | MongoDB & Mongoose (with synchronized resilient memory repository fallback) |
| **Payment Gateway**| Razorpay (Test Mode & Live Mode Ready) |
| **Document/ID Export** | `qrcode.react`, `html2canvas`, `jspdf` |

---

## 📁 Project Architecture

```
smart-id/
├── index.html                    # Root HTML with Google Fonts & Razorpay Script
├── package.json                  # Unified root dependencies and scripts
├── vite.config.js                # Vite config with /api proxy to backend (port 5000)
├── README.md                     # Comprehensive documentation & setup guide
├── .gitignore                    # Git ignore file protecting .env & node_modules
├── src/
│   ├── main.jsx                  # React DOM entry point
│   ├── App.jsx                   # Central application state & routing controller
│   ├── App.css                   # Custom collegiate design system stylesheet
│   └── components/
│       ├── Header.jsx            # Top header with role switcher (Student / Admin)
│       ├── Dashboard.jsx         # Main portal dashboard with quick actions & preview
│       ├── ModeSelector.jsx      # Policy selection (Smart ID vs Common ID)
│       ├── StudentForm.jsx       # Controlled personal & academic input form
│       ├── StudentStatus.jsx     # Accommodation & transport status cards
│       ├── PhotoUpload.jsx       # Immediate photo preview, replace & remove
│       ├── DocumentUpload.jsx    # Document upload UI with status badges
│       ├── VerificationPanel.jsx # Administrative document review & rejection flow
│       ├── FeeSummary.jsx        # Transparent fee computation summary
│       ├── Payment.jsx           # Razorpay checkout launcher & order initiator
│       ├── PaymentSuccess.jsx    # Payment success screen with celebration confetti
│       ├── PaymentFailure.jsx    # Payment failure screen with retry triggers
│       ├── ApplicationStatus.jsx # Real-time application tracking with stepper
│       ├── PaymentHistory.jsx    # Payment history table with printable receipt modal
│       ├── IDCard.jsx            # 3D interactive flip container
│       ├── IDCardFront.jsx       # Front face (Vertical Green vs Horizontal Blue)
│       ├── IDCardBack.jsx        # Back face (Emergency contacts & signature)
│       ├── QRCode.jsx            # Dynamic SVG QR code generator
│       ├── DownloadButton.jsx    # PDF/PNG export & print integration
│       └── AdminDashboard.jsx    # Officer stats, table filters & fee config
└── server/
    ├── server.js                 # Express server entry point (port 5000)
    ├── .env                      # Environment variables (Mongo URI & Razorpay keys)
    ├── .env.example              # Sample environment template
    ├── config/
    │   ├── db.js                 # MongoDB connection handler
    │   ├── fees.js               # Fee configuration and calculation rules
    │   └── store.js              # Resilient dual-store repository & ID generators
    ├── controllers/
    │   ├── studentController.js
    │   ├── applicationController.js
    │   ├── verificationController.js
    │   └── paymentController.js
    ├── models/
    │   ├── Student.js
    │   ├── Application.js
    │   ├── Payment.js
    │   └── Document.js
    ├── routes/
    │   ├── studentRoutes.js
    │   ├── applicationRoutes.js
    │   ├── verificationRoutes.js
    │   └── paymentRoutes.js
    └── middleware/
        └── errorHandler.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: Local mongod instance or MongoDB Atlas URI (if not present, the system operates in resilient in-memory mode seamlessly).

### 2. Installation
Open your terminal in the project root directory and run:
```bash
npm install
```

### 3. Running the System

You can run both Frontend and Backend concurrently with a single command:
```bash
npm run dev:all
```

Or run them individually in separate terminal tabs:

**Terminal 1 — Backend API Server (Port 5000):**
```bash
npm run server
```

**Terminal 2 — Frontend Dev Server (Port 5173):**
```bash
npm run dev
```

Visit the app in your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 💳 Razorpay Payment Configuration

### 1. Razorpay Test Mode Setup
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Test Mode** in the top navigation bar.
3. Go to **Settings** &rarr; **API Keys** &rarr; **Generate Key**.
4. Copy your **Key ID** (`rzp_test_...`) and **Key Secret**.
5. Open `server/.env` and paste your keys:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   RAZORPAY_KEY_SECRET=your_key_secret_here
   ```
6. Restart the backend server (`npm run server`).

### 2. Testing Payments Without a Real Card
When Razorpay keys are configured, Razorpay's test modal provides instant test options:
- **Card**: Enter test card number `4111 1111 1111 1111`, any future expiry date, and any 3-digit CVV.
- **UPI**: Enter `success@razorpay` for approved payment or `failure@razorpay` to test declines.
- **NetBanking**: Select any test bank (e.g., SBI, HDFC) and click **Success**.

> **Sandbox Simulation Mode**: If you have not created a Razorpay account yet, the application includes a built-in test sandbox that simulates orders and verification signatures out of the box with "Simulate Test Payment" and "Simulate Payment Failure" buttons!

### 3. Switching to Production / Live Credentials
When ready to go live:
1. Complete Razorpay KYC activation.
2. Toggle from **Test Mode** to **Live Mode** in your Razorpay Dashboard.
3. Generate **Live Key ID** (`rzp_live_...`) and **Live Key Secret**.
4. Replace the credentials in `server/.env`.

---

## 🔒 Security Best Practices

1. **Never Expose Secret Keys**: The `RAZORPAY_KEY_SECRET` and `MONGODB_URI` are exclusively read by the Node.js backend. They are **never** bundled or accessed by Vite/React frontend code.
2. **Backend Authoritative Pricing**: Payment amounts are computed from the backend application record (`app.totalAmount`) and converted to paise on the server. Never rely on client-submitted prices.
3. **Cryptographic Signature Verification**: Payments are only marked `PAID` after verifying the SHA-256 HMAC hash constructed from `order_id` + `|` + `payment_id` with your `RAZORPAY_KEY_SECRET`.
4. **Git Protection**: `server/.env` is included in `.gitignore` to prevent secret leaks to version control.

---

## 🧪 Testing the Complete Workflow

1. **Home Page**: Review current stats and student profile (`Aarav Sharma`). Flip the ID card back and forth.
2. **Start Application**: Click **Apply for ID**.
3. **Choose Policy**: Click **Use Smart ID Rules**.
4. **Test Hosteller ID**: Select **College Hostel** &rarr; Live preview displays a **Vertical Green Hosteller ID**.
5. **Test Day Scholar ID**: Select **College Bus / Day Scholar** &rarr; Live preview updates to a **Horizontal Blue Day Scholar ID**.
6. **Test Status Change Detection**:
   - Set **Academic Records — Previous Enrolled Status** to **College Hostel**.
   - Select **Outside Hostel / PG** or **College Bus**.
   - Notice the amber warning: `⚠️ Status Change Detected`.
   - The required document upload cards for **Vacated College Hostel Form** appear.
7. **Upload Documents**: Click **Upload Document** and attach test clearance files.
8. **Admin Approval**:
   - Switch to **Admin / Verifier View** via the top header.
   - Go to **Verification Queue** or **Admin Panel**.
   - Click **✓ Approve Documents**.
9. **Online Payment**:
   - Proceed to payment.
   - Click **Pay ₹110.00 Now** (or use the test simulation button).
   - Backend verifies the transaction signature and marks `paymentStatus = "PAID"`.
10. **Issue Digital ID**:
    - View the generated digital ID.
    - Click **Download ID Card (PDF)** for a high-res printable student card.
    - Click **Download Receipt** to view the audited payment receipt.

---

## 📄 License
This project is developed for educational and institutional identity management demonstrations.
