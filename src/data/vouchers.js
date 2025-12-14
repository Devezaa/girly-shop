/**
 * 🌸 Voucher Data Type Definition
 * @typedef {Object} Voucher
 * @property {number} id - Unique ID
 * @property {string} code - Short coupon code (e.g., "SAVE30")
 * @property {string} title - Descriptive title
 * @property {string} subtitle - Secondary description
 * @property {string} category - Category for filtering (e.g., "All", "Shipping", "Face")
 * @property {number} discountAmount - Discount value (0.30 for 30%)
 * @property {"percentage" | "fixed"} type - Discount type
 * @property {string} displayDiscount - Display text (e.g., "30%")
 * @property {string} valid - Friendly validity text
 * @property {string} expiryDate - ISO date string for logic
 * @property {string} color - Background gradient classes
 * @property {string} textColor - Text color class
 */

/**
 * 🌸 Lovely Boutique — Vouchers Data
 * ----------------------------------
 * Mock vouchers for the Vouchers page.
 * Includes categories and expiry logic.
 *
 * @type {Voucher[]}
 */
export const vouchers = [
    {
        id: 1,
        code: "WELCOME30",
        title: "New Member Special",
        subtitle: "30% Off All Categories",
        category: "All",
        discountAmount: 0.3, // 30%
        type: "percentage",
        displayDiscount: "30%",
        valid: "Valid Until 31 Dec 2025",
        expiryDate: "2025-12-31",
        color: "from-teal-200 to-teal-100",
        textColor: "text-gray-700",
    },
    {
        id: 2,
        code: "SHIPPINGFREE",
        title: "Free Shipping",
        subtitle: "Min. spend $50",
        category: "Shipping",
        discountAmount: 0, // Free shipping logical flag could be added here
        type: "fixed",
        displayDiscount: "FREE",
        valid: "Valid Until 30 Apr 2025",
        expiryDate: "2025-04-30",
        color: "from-blue-200 to-blue-100",
        textColor: "text-blue-800",
    },
    {
        id: 3,
        code: "RAMADHAN60",
        title: "Ramadhan Special",
        subtitle: "Huge Savings for the Holy Month",
        category: "All",
        discountAmount: 0.6, // 60%
        type: "percentage",
        displayDiscount: "60%",
        valid: "Valid Until 30 Apr 2025",
        expiryDate: "2025-04-30",
        color: "from-teal-300 to-teal-100",
        textColor: "text-gray-800",
    },
    {
        id: 4,
        code: "PAYDAY50",
        title: "Pay Day Sale",
        subtitle: "Treat yourself this Pay Day!",
        category: "Fashion",
        discountAmount: 0.5, // 50%
        type: "percentage",
        displayDiscount: "50%",
        valid: "Valid Until 31 May 2025",
        expiryDate: "2025-05-31",
        color: "from-emerald-300 to-emerald-100",
        textColor: "text-gray-800",
    },
    {
        id: 5,
        code: "GLOW25",
        title: "Skincare Glow Up",
        subtitle: "25% Off Face Products",
        category: "Face",
        discountAmount: 0.25, // 25%
        type: "percentage",
        displayDiscount: "25%",
        valid: "Valid Until 30 Jun 2025",
        expiryDate: "2025-06-30",
        color: "from-cyan-200 to-cyan-100",
        textColor: "text-gray-800",
    },
];
