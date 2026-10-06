import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    role: {
        type: String,
        enum: ["customer", "admin", "superadmin"],
        default: "customer",
        // customer    → can shop, place orders, write reviews
        // admin       → can manage products, orders
        // superadmin  → can manage everything including other admins
    },

    permissions: {
        type: [String],
        default: [],
        // Examples:
        // "products:read"   → can view products in admin
        // "products:write"  → can add/edit products
        // "orders:read"     → can view all orders
        // "orders:write"    → can update order status
        // "users:read"      → can view all users
        // "users:write"     → can edit/delete users
    },

    avatar: {
        type: String,
        default: "",
    },

    phone: {
        type: String,
        default: "",
    },

    addresses: [
        {
            label: {
                type: String,
                default: "Home",
            },
            street: String,
            city: String,
            state: String,
            pincode: String,
            isDefault: {
                type: Boolean,
                default: false,
            },
        },
    ],

    isVerified: {
        type: Boolean,
        default: false,
    },

    resetPasswordToken: {
        type: String,
        default: null,
    },

    resetPasswordExpiry: {
        type: Date,
        default: null,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

},
    {
        timestamps: true,
    }
)

userSchema.index({ role: 1 })

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
