
import mongoose from 'mongoose'



const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
})

const shippingAddressSchema = new mongoose.Schema(
    {
        label: { type: String, default: "Home" },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    { _id: false }
)

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
    },

    shippingAddress: {
        type: shippingAddressSchema,
        required: true,
    },

    subtotal: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },

    paymentMethod: {
        type: String,
        enum: ["razorpay", "cod"],
        default: "cod",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },

    razorpayOrderId: {
        type: String,
        default: "",
    },
    razorpayPaymentId: {
        type: String,
        default: "",
    },
    razorpaySignature: {
        type: String,
        default: "",
    },

    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
        default: "placed",
    },

}, { timestamps: true, })



OrderSchema.index({ user: 1, createdAt: -1 })


OrderSchema.index({ orderStatus: 1 })

OrderSchema.index({ razorpayOrderId: 1 })

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema)

export default Order