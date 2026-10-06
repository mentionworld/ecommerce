import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxLength: [5000, 'Description cannot be more than 5000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    images: {
        type: [String],
        required: [true, 'Images are required'],
        default: []
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    brand: {
        type: String,
        default: "",
        trim: true,
        lowercase: true
    },
    comparePrice: {
        type: Number,
        min: [0, "Cannot be negative"],
        default: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Cannot be negative"],
        default: 0
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    isFeatured: {
        type: Boolean,
        default: false,
    },

    tags: {
        type: [String],
        default: [],
    },

    specifications: {
        type: Map,
        of: String,
        default: {}
    }


}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


productSchema.index({ category: 1 })

productSchema.index({ brand: 1 })

productSchema.index({ isFeatured: 1 })
productSchema.index({ isActive: 1 })

productSchema.index({ 'ratings.average': -1 })

productSchema.index({ isActive: 1, category: 1 })
productSchema.index({ isActive: 1, brand: 1 })

productSchema.index({ price: 1 })

productSchema.index({ name: 'text', description: 'text', tags: 'text' })

productSchema.virtual('discountPercentage').get(function () {
    if (!this.comparePrice || this.comparePrice < this.price) return 0
    if (this.comparePrice && this.comparePrice > 0) {
        return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100)
    }
    return 0
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
