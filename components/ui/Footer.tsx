import Link from "next/link"


export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-brand">
                    <h3>ShopMart</h3>
                    <p>India's best online shopping destination</p>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <Link href="/products">Products</Link>
                    <Link href="/cart">Cart</Link>
                    <Link href="/login">Login</Link>
                </div>

                <div className="footer-links">
                    <h4>Support</h4>
                    <Link href="/orders">My Orders</Link>
                    <Link href="/contact">Contact Us</Link>
                </div>

            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 ShopMart. All rights reserved.</p>
            </div>
        </footer>
    )
}