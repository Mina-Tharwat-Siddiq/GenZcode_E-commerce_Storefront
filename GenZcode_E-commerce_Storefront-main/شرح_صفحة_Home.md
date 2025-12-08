# شرح صفحة Home سطر بسطر

## ملف Home.jsx

### السطور 1-8: الاستيرادات (Imports)

```1:8:src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import './Home.css';
```

**الشرح:**
- **السطر 1**: استيراد `useState` و `useEffect` من React لإدارة الحالة والتأثيرات الجانبية
- **السطر 2**: استيراد `Link` من react-router-dom لإنشاء روابط داخل التطبيق
- **السطر 3**: استيراد مكون Header (رأس الصفحة)
- **السطر 4**: استيراد مكون Footer (تذييل الصفحة)
- **السطر 5**: استيراد مكون Newsletter (نشرة إخبارية)
- **السطر 6**: استيراد مكون ProductCard لعرض بطاقة المنتج
- **السطر 7**: استيراد `useProducts` من Context لإدارة المنتجات
- **السطر 8**: استيراد ملف CSS الخاص بالصفحة

---

### السطور 10-14: تعريف المكون والحالة (Component & State)

```10:14:src/pages/Home.jsx
function Home() {
    const { products, loading, fetchProducts } = useProducts();
    const [bestSelling, setBestSelling] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('featured');
```

**الشرح:**
- **السطر 10**: تعريف دالة المكون الرئيسي `Home`
- **السطر 11**: استخدام Hook `useProducts` للحصول على:
  - `products`: قائمة المنتجات
  - `loading`: حالة التحميل
  - `fetchProducts`: دالة جلب المنتجات
- **السطر 12**: حالة `bestSelling` لتخزين أفضل المنتجات مبيعاً (مصفوفة فارغة في البداية)
- **السطر 13**: حالة `featuredProducts` لتخزين المنتجات المميزة (مصفوفة فارغة في البداية)
- **السطر 14**: حالة `activeTab` لتحديد التبويب النشط ('featured' أو 'latest') - القيمة الافتراضية 'featured'

---

### السطور 16-19: Effect لجلب المنتجات عند التحميل

```16:19:src/pages/Home.jsx
    useEffect(() => {
        fetchProducts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
```

**الشرح:**
- **السطر 16**: استخدام `useEffect` لتنفيذ كود عند تحميل المكون
- **السطر 17**: استدعاء `fetchProducts(1)` لجلب المنتجات من الصفحة الأولى
- **السطر 18**: تعطيل تحذير ESLint لأننا لا نريد إضافة `fetchProducts` في dependencies
- **السطر 19**: مصفوفة dependencies فارغة `[]` يعني أن هذا Effect يعمل مرة واحدة فقط عند التحميل الأول

---

### السطور 21-28: Effect لترتيب المنتجات

```21:28:src/pages/Home.jsx
    useEffect(() => {
        // جلب أفضل 4 منتجات مبيعاً
        if (products.length > 0) {
            const sorted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setBestSelling(sorted.slice(0, 4));
            setFeaturedProducts(sorted.slice(0, 4));
        }
    }, [products]);
```

**الشرح:**
- **السطر 21**: Effect آخر يعمل عند تغيير `products`
- **السطر 22**: تعليق بالعربية يوضح الهدف
- **السطر 23**: التحقق من وجود منتجات في القائمة
- **السطر 24**: 
  - `[...products]`: نسخ المصفوفة لتجنب تعديل الأصلية
  - `.sort()`: ترتيب المنتجات حسب التقييم (rating) من الأعلى للأقل
  - `(b.rating || 0) - (a.rating || 0)`: إذا لم يكن هناك rating، استخدم 0
- **السطر 25**: أخذ أول 4 منتجات وتخزينها في `bestSelling`
- **السطر 26**: نفس المنتجات الأربعة تُخزن في `featuredProducts`
- **السطر 28**: `[products]` يعني أن Effect يعمل كلما تغيرت قائمة المنتجات

---

### السطور 30-32: بداية JSX

```30:32:src/pages/Home.jsx
    return (
        <div className="home-page">
            <Header />
```

**الشرح:**
- **السطر 30**: بداية return للعناصر المراد عرضها
- **السطر 31**: div رئيسي بكلاس `home-page` يحتوي على كل الصفحة
- **السطر 32**: إدراج مكون Header (رأس الصفحة)

---

### السطور 34-75: قسم Hero (القسم الرئيسي)

```34:75:src/pages/Home.jsx
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1 className="hero-title">Fresh Arrivals Online</h1>
                                <p className="hero-subtitle">Discover Our Newest Collection Today.</p>
                                <Link to="/search" className="hero-btn">
                                    View Collection
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image-container">
                                <div className="hero-circle">
                                    <div className="star-icon">
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                    <div className="hero-model">
                                        <img 
                                            src="/e52f9cf6cc856def87647021dd851ac0c535f64b.png" 
                                            alt="Model" 
                                            className="model-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextElementSibling) {
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                        <div className="model-placeholder" style={{ display: 'none' }}>
                                            <i className="bi bi-person"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
```

**الشرح:**
- **السطر 34**: تعليق يوضح أن هذا قسم Hero
- **السطر 35**: قسم `section` بكلاس `hero-section` (خلفية برتقالية)
- **السطر 36**: `container` من Bootstrap لتحديد العرض
- **السطر 37**: `row` مع `align-items-center` لترتيب العناصر عمودياً في المنتصف
- **السطر 38**: عمود `col-lg-6` (نصف العرض على الشاشات الكبيرة) للمحتوى النصي
- **السطر 39**: div للمحتوى النصي
- **السطر 40**: عنوان رئيسي "Fresh Arrivals Online"
- **السطر 41**: عنوان فرعي "Discover Our Newest Collection Today."
- **السطر 42**: رابط `Link` إلى صفحة البحث `/search`
- **السطر 43**: نص الزر "View Collection"
- **السطر 44**: أيقونة سهم من Bootstrap Icons
- **السطر 48**: عمود آخر `col-lg-6` للصورة
- **السطر 49**: حاوية الصورة
- **السطر 50**: دائرة برتقالية كبيرة
- **السطر 51-53**: أيقونة نجمة في الزاوية
- **السطر 54**: div للصورة الدائرية
- **السطر 55-58**: صورة الموديل مع:
  - `src`: مسار الصورة
  - `alt`: نص بديل
  - `className`: كلاس CSS
- **السطر 59-64**: معالج `onError` عند فشل تحميل الصورة:
  - إخفاء الصورة
  - إظهار placeholder بدلاً منها
- **السطر 66-68**: placeholder مخفي افتراضياً (أيقونة شخص)

---

### السطور 77-116: قسم المميزات (Features Section)

```77:116:src/pages/Home.jsx
            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-truck"></i>
                                </div>
                                <h3 className="feature-title">Free Shipping</h3>
                                <p className="feature-description">
                                    Upgrade your style today and get FREE shipping on all orders! Don't miss out.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-house-check"></i>
                                </div>
                                <h3 className="feature-title">Satisfaction Guarantee</h3>
                                <p className="feature-description">
                                    Shop confidently with our Satisfaction Guarantee: Love it or get a refund.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <h3 className="feature-title">Secure Payment</h3>
                                <p className="feature-description">
                                    Your security is our priority. Your payments are secure with us.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
```

**الشرح:**
- **السطر 77**: تعليق لقسم المميزات
- **السطر 78**: قسم `features-section`
- **السطر 79**: container
- **السطر 80**: row
- **السطر 81**: عمود `col-md-4` (ثلث العرض) للميزة الأولى
  - `mb-4`: هامش سفلي على الشاشات الصغيرة
  - `mb-md-0`: إزالة الهامش على الشاشات المتوسطة فما فوق
- **السطر 82**: بطاقة الميزة
- **السطر 83-85**: أيقونة شاحنة (Free Shipping)
- **السطر 86**: عنوان الميزة
- **السطر 87-89**: وصف الميزة
- **السطر 92-101**: الميزة الثانية (Satisfaction Guarantee) - أيقونة منزل
- **السطر 103-112**: الميزة الثالثة (Secure Payment) - أيقونة درع

---

### السطور 118-145: قسم أفضل المنتجات مبيعاً

```118:145:src/pages/Home.jsx
            {/* Best Selling Products Section */}
            <section className="best-selling-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">SHOP NOW</span>
                        <h2 className="section-title">Best Selling</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="products-grid-home">
                            {bestSelling.length > 0 ? (
                                bestSelling.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p>No products available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
```

**الشرح:**
- **السطر 118**: تعليق
- **السطر 119**: قسم `best-selling-section`
- **السطر 120**: container
- **السطر 121-124**: رأس القسم:
  - `section-label`: تسمية "SHOP NOW"
  - `section-title`: عنوان "Best Selling"
- **السطر 125**: شرط `loading` - إذا كان التحميل جارياً
- **السطر 126-129**: عرض spinner (دائرة تحميل)
- **السطر 130**: `else` - إذا انتهى التحميل
- **السطر 131**: grid للمنتجات
- **السطر 132**: شرط وجود منتجات
- **السطر 133-135**: استخدام `map` لعرض كل منتج:
  - `key={product.id}`: مفتاح فريد لكل عنصر
  - `ProductCard`: مكون بطاقة المنتج
- **السطر 136**: `else` - إذا لم توجد منتجات
- **السطر 137-139**: رسالة "No products available"

---

### السطور 147-183: قسم Browse Fashion

```147:183:src/pages/Home.jsx
            {/* Browse Fashion Paradise Section */}
            <section className="browse-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="browse-content">
                                <h2 className="browse-title">Browse Our Fashion Paradise!</h2>
                                <p className="browse-description">
                                    Step into a world of style and explore our diverse collection of clothing categories.
                                </p>
                                <Link to="/search" className="browse-btn">
                                    Start Browsing
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="browse-image-container">
                                <img 
                                    src="/nike-tshirt.png" 
                                    alt="Nike T-Shirt" 
                                    className="browse-tshirt-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextElementSibling) {
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                                <div className="browse-image-placeholder" style={{ display: 'none' }}>
                                    <i className="bi bi-image"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
```

**الشرح:**
- **السطر 147**: تعليق
- **السطر 148**: قسم `browse-section` (خلفية متدرجة)
- **السطر 149**: container
- **السطر 150**: row مع محاذاة عمودية
- **السطر 151**: عمود للمحتوى النصي
- **السطر 152**: div للمحتوى
- **السطر 153**: عنوان "Browse Our Fashion Paradise!"
- **السطر 154-156**: وصف
- **السطر 157**: رابط إلى صفحة البحث
- **السطر 158**: نص "Start Browsing"
- **السطر 159**: أيقونة سهم
- **السطر 163**: عمود للصورة
- **السطر 164**: حاوية الصورة
- **السطر 165-168**: صورة قميص Nike مع معالج `onError` مشابه للصورة السابقة
- **السطر 176-178**: placeholder للصورة

---

### السطور 185-222: قسم المنتجات المميزة/الأحدث

```185:222:src/pages/Home.jsx
            {/* Featured/Latest Products Section */}
            <section className="featured-products-section">
                <div className="container">
                    <div className="products-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
                            onClick={() => setActiveTab('featured')}
                        >
                            Featured
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'latest' ? 'active' : ''}`}
                            onClick={() => setActiveTab('latest')}
                        >
                            Latest
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="featured-products-grid">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p>No products available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
```

**الشرح:**
- **السطر 185**: تعليق
- **السطر 186**: قسم `featured-products-section`
- **السطر 187**: container
- **السطر 188**: div للتبويبات
- **السطر 189-194**: زر التبويب الأول "Featured":
  - `className`: يضيف 'active' إذا كان `activeTab === 'featured'`
  - `onClick`: تغيير `activeTab` إلى 'featured'
- **السطر 195-200**: زر التبويب الثاني "Latest" - نفس المنطق
- **السطر 201-207**: spinner أثناء التحميل (نفس منطق قسم Best Selling)
- **السطر 208**: grid للمنتجات
- **السطر 209-213**: عرض المنتجات باستخدام `map`
- **السطر 214-217**: رسالة عند عدم وجود منتجات

---

### السطور 224-230: إغلاق الصفحة

```224:230:src/pages/Home.jsx
            <Newsletter />
            <Footer />
        </div>
    );
}

export default Home;
```

**الشرح:**
- **السطر 224**: مكون Newsletter (نشرة إخبارية)
- **السطر 225**: مكون Footer (تذييل الصفحة)
- **السطر 226**: إغلاق div الرئيسي
- **السطر 227**: إغلاق return
- **السطر 228**: إغلاق دالة Home
- **السطر 230**: تصدير المكون كـ default export

---

## ملخص بنية الصفحة:

1. **Header**: رأس الصفحة مع القائمة
2. **Hero Section**: قسم رئيسي مع عنوان وصورة
3. **Features Section**: 3 مميزات (شحن مجاني، ضمان، دفع آمن)
4. **Best Selling Section**: أفضل المنتجات مبيعاً
5. **Browse Section**: دعوة للتصفح مع صورة
6. **Featured/Latest Section**: منتجات مميزة/أحدث مع تبويبات
7. **Newsletter**: نشرة إخبارية
8. **Footer**: تذييل الصفحة

---

## ملاحظات مهمة:

- الصفحة تستخدم **React Hooks** (`useState`, `useEffect`)
- تستخدم **Context API** لإدارة حالة المنتجات
- تستخدم **React Router** للتنقل بين الصفحات
- تستخدم **Bootstrap** للتصميم المتجاوب
- تحتوي على معالجة للأخطاء عند فشل تحميل الصور
- تعرض spinner أثناء التحميل
- تصميم متجاوب يعمل على جميع الأجهزة

