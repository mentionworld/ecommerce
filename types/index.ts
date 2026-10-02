export type TProduct = {
    _id: string
    name: string
    slug: string
    description: string
    price: number
    comparePrice: number
    images: string[]
    category: string
    brand: string
    stock: number
    ratings: {
        average: number
        count: number
    }
    isActive: boolean
    isFeatured: boolean
    tags: string[]
    specifications: Record<string, string>
    discountPercentage: number
    createdAt: string
    updatedAt: string
}

export type TPagination = {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export type TFilters = {
    categories: string[]
    brands: string[]
    priceRange: {
        min: number
        max: number
    }
    ratings: number[]
}

export type TProductsResponse = {
    products: TProduct[]
    pagination: TPagination
    filters: TFilters
}

export type TShowcaseResponse = {
    featured: TProduct[]
    newArrivals: TProduct[]
    topRated: TProduct[]
    deals: TProduct[]
}

export type TPermission =
    | "product:read"
    | "product:write"
    | "order:read"
    | "order:write"
    | "user:read"
    | "user:write"

export type TRole = "customer" | "admin" | "superadmin"

export type TAddress = {
    _id: string,
    label: string,
    street: string,
    city: string,
    state: string,
    pincode: string,
    isDefault: boolean,
}

export type Tuser = {
    _id: string,
    name: string,
    email: string,
    password: string,
    role: TRole,
    permissions: TPermission[],
    avatar: string,
    phone: string,
    addresses: TAddress[],
    isVerified: boolean,
    resetPasswordToken: string,
    resetPasswordExpiry: Date,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export type TAuthUser = Pick<Tuser, "_id" | "name" | "email" | "role" | "permissions" | "avatar">

export type TJwtPayload = {
    userId: string,
    email: string,
    role: TRole,
    permissions: TPermission[]
}

export type TCartDBItem = {
    product: string,
    price: number,
    quantity: number
}

export type TCart = {
    _id: string,
    user: string,
    items: TCartDBItem[],
    createdAt: Date,
    updatedAt: Date
}

export type TCartItemPopulated = {
    product: TProduct,
    price: number,
    quantity: number
}


export type TOrderItem = {
    product: string
    name: string
    image: string
    price: number
    quantity: number
}

export type TShippingAddress = {
    label: string
    street: string
    city: string
    state: string
    pincode: string
}

export type TPaymentStatus = "pending" | "paid" | "failed"
export type TOrderStatus =
    | "placed"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"

export type TOrder = {
    _id: string
    user: string
    items: TOrderItem[]
    shippingAddress: TShippingAddress
    subtotal: number
    shippingCost: number
    total: number
    paymentMethod: "razorpay" | "cod"
    paymentStatus: TPaymentStatus
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
    orderStatus: TOrderStatus
    createdAt: string
    updatedAt: string
}
