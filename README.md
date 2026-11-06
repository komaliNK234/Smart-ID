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
  - Clearance documents are stored with the application; PDF/JPG/PNG uploads are limited to 4 MB each.
- **College Hostel &rarr; College Bus / Day Scholar**:
  - The **📄 Vacated College Hostel Form** must be submitted and approved before fee payment is enabled.

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
  - **New ID, Renewal, Replacement, Status Change ID**: ₹100 each
  - **Portal Processing Fee**: ₹0
- Admin can modify fee rates directly through the Administrative Settings modal.
- Amounts are securely computed and validated by the Node.js backend.

### 6. Demo Payment Flow
- `/api/payment/create-order` and `/api/payment/verify-payment` implement a simulated checkout.
- The checkout offers demo method choices and a test failure path; **it does not contact Razorpay, banks, UPI apps, or move money**.
- Demo success creates a clearly labeled demo receipt and unlocks the sample ID card.
- Razorpay is present as a dependency/config placeholder only; live payment processing is not implemented.

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
| **Backend** | Node.js, Express.js, Cors, Dotenv, Node.js Crypto (password hashing) |
| **Database** | MongoDB & Mongoose (with synchronized resilient memory repository fallback) |
| **Payments**| CampusID demo simulation only; no live payment gateway |
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
│   ├── api.js                    # Shared frontend API base and response handling
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
│       ├── Payment.jsx           # Clearly labeled simulated payment checkout
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

Local development sends all `/api` requests through the Vite proxy to `http://localhost:5000`. For a separately hosted frontend/API, set `VITE_API_BASE_URL` when building the frontend; do not put private keys in frontend variables.

---

## 💳 Demo Payment Behavior

The current approved configuration is **demo-only**. The UI explicitly warns that no real charge occurs, does not ask for card or bank details, and labels receipts as demonstrations. The test failure action verifies the failure UI and can be retried. Razorpay credentials in `server/.env` are not used by this flow; do not treat demo receipts as proof of payment. Real payment processing requires a separately approved gateway integration and secure server-side credentials.

---

## 🔒 Security Best Practices

1. Student passwords are hashed with Node.js `scrypt` before persistence; they are not returned by the authentication API.
2. Demo payment amounts come from the backend application record; the frontend does not submit an amount to mark paid.
3. This project remains a demonstration, not a production identity or payment service. API routes do not yet enforce authenticated server-side roles, and the browser's local session state is not a secure credential. Do not deploy with real student data or live payment expectations until server-side authorization and a payment provider are configured.
4. Keep `.env` files out of source control; never put private credentials in frontend configuration.

---

## 🧪 Testing the Complete Workflow

1. **Create Account / Sign In**: Use the API-backed account form, or choose a visibly labeled **Demo access** profile.
2. **Dashboard**: Review student-specific applications and use **Apply for ID**.
3. **Choose Policy**: Click **Use Smart ID Rules**.
4. **Test Hosteller ID**: Select **College Hostel** &rarr; Live preview displays a **Vertical Green Hosteller ID**.
5. **Test Day Scholar ID**: Select **College Bus / Day Scholar** &rarr; Live preview updates to a **Horizontal Blue Day Scholar ID**.
6. **Test Status Change Detection**:
   - Set **Academic Records — Previous Enrolled Status** to **College Hostel**.
   - Select **Outside Hostel / PG** or **College Bus**.
   - Notice the amber warning: `⚠️ Status Change Detected`.
   - The required document upload cards for **Vacated College Hostel Form** appear.
7. **Upload Documents**: Upload a PDF/JPG/PNG clearance file (up to 4 MB) or use the labeled demo receipt.
8. **Admin Approval**:
   - Switch to **Admin / Verifier View** via the top header.
   - Go to **Verification Queue** or **Admin Panel**.
   - Click **✓ Approve Documents**.
9. **Demo Payment**:
   - Proceed to the clearly labeled demo checkout.
   - Choose a simulated method and complete the demo payment; no real charge occurs.
   - The backend records a demo receipt and marks the application as paid for demonstration.
10. **Issue Digital ID**:
    - View the generated digital ID.
    - Click **Download ID Card (PDF)** for a high-res printable student card.
    - Click **Download Receipt** to view the audited payment receipt.

---

## 📄 License
This project is developed for educational and institutional identity management demonstrations.
