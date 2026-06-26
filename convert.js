const fs = require('fs');

const oldContent = fs.readFileSync('old_checkout.tsx', 'utf-16le');

let newContent = oldContent
  // Fix imports
  .replace(/import \{ useNavigate \} from 'react-router-dom';/, "import { useRouter } from 'next/navigation';")
  .replace(/import \{ useAuth \} from '\.\.\/contexts\/AuthContext';/, "import { useAuth } from '@/store/useAuth';")
  .replace(/import \{ useCart \} from '\.\.\/contexts\/CartContext';/, "import { useCart } from '@/store/useCart';")
  .replace(/import \{ useToast \} from '\.\.\/contexts\/ToastContext';/, "import { useToast } from '@/components/Feedback/ToastProvider';")
  .replace(/import \{ PaymentMethodSelector \} from '\.\.\/components\/Checkout\/PaymentMethodSelector';/, "import { PaymentMethodSelector } from '@/components/Checkout/PaymentMethodSelector';")
  .replace(/import \{ BankTransferDetails \} from '\.\.\/components\/Checkout\/BankTransferDetails';/, "import { BankTransferDetails } from '@/components/Checkout/BankTransferDetails';")
  .replace(/import \{ BizumDetails \} from '\.\.\/components\/Checkout\/BizumDetails';/, "import { BizumDetails } from '@/components/Checkout/BizumDetails';")
  .replace(/import \{ Address, ShippingOption \} from '\.\.\/types';/, "import { Address, ShippingOption } from '@/types';")
  .replace(/import \{ sendOrderConfirmationEmails, generateOrderNumber, OrderEmailData \} from '\.\.\/services\/emailService';/, "") // Delete this for now
  
  // Fix React usage
  .replace(/const navigate = useNavigate\(\);/, "const router = useRouter();")
  .replace(/navigate\('/g, "router.push('")
  
  // Fix other things
  .replace(/sendOrderConfirmationEmails\(emailData\);/, "")
  .replace(/const emailData:/, "const emailData: any =")
  .replace(/useToast\(\);/, "useToast();")
  .replace(/const \{ showToast \} = useToast\(\);/, "const toast = useToast();\n  const showToast = (msg, type) => type === 'error' ? toast.error({title:'Error', message:msg}) : toast.success({title:'Éxito', message:msg});")
  .replace(/const CheckoutPage: React\.FC = \(\) => \{/, "export default function CheckoutPage() {")
  .replace(/export default CheckoutPage;/, "");

// Prepend "use client";
newContent = "'use client';\n" + newContent;

fs.writeFileSync('src/app/checkout/page.tsx', newContent, 'utf-8');
console.log('Conversion complete!');
