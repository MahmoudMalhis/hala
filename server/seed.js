// server/seed.js
const { connectDB, run, get, all } = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

        await connectDB();
      console.log("✅ Database connected");
      
    // 1. إضافة أنواع الغرف
    console.log('📦 Adding room types...');
    const roomTypes = [
      {
        name_ar: 'غرفة معيشة',
        name_en: 'Living Room',
        imageURL: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800'
      },
      {
        name_ar: 'غرفة نوم',
        name_en: 'Bedroom',
        imageURL: 'https://images.unsplash.com/photo-1560185007-cde436f6a4c0?w=800'
      },
      {
        name_ar: 'مطبخ',
        name_en: 'Kitchen',
        imageURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
      },
      {
        name_ar: 'حمام',
        name_en: 'Bathroom',
        imageURL: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'
      },
      {
        name_ar: 'مكتب',
        name_en: 'Office',
        imageURL: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      },
      {
        name_ar: 'شرفة',
        name_en: 'Balcony',
        imageURL: 'https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=800'
      }
    ];

    const roomTypeIds = [];
    for (const room of roomTypes) {
      const result = await run(
        'INSERT INTO room_types (name_ar, name_en, imageURL) VALUES (?, ?, ?)',
        [room.name_ar, room.name_en, room.imageURL]
      );
      roomTypeIds.push(result.id);
      console.log(`✅ Added room type: ${room.name_en}`);
    }

    // 2. إضافة أنواع التصميم
    console.log('🎨 Adding design types...');
    const designTypes = [
      {
        name_ar: 'عصري',
        name_en: 'Modern',
        imageURL: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'
      },
      {
        name_ar: 'كلاسيكي',
        name_en: 'Classic',
        imageURL: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      },
      {
        name_ar: 'مينيماليست',
        name_en: 'Minimalist',
        imageURL: 'https://images.unsplash.com/photo-1511389026070-a14ae610a1be?w=800'
      },
      {
        name_ar: 'صناعي',
        name_en: 'Industrial',
        imageURL: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
      },
      {
        name_ar: 'اسكندنافي',
        name_en: 'Scandinavian',
        imageURL: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800'
      },
      {
        name_ar: 'بوهيمي',
        name_en: 'Bohemian',
        imageURL: 'https://images.unsplash.com/photo-1522444690501-ecaf55fb0b56?w=800'
      }
    ];

    const designTypeIds = [];
    for (const design of designTypes) {
      const result = await run(
        'INSERT INTO design_types (name_ar, name_en, imageURL) VALUES (?, ?, ?)',
        [design.name_ar, design.name_en, design.imageURL]
      );
      designTypeIds.push(result.id);
      console.log(`✅ Added design type: ${design.name_en}`);
    }

    // 3. إضافة صور المعرض
    console.log('🖼️ Adding gallery images...');
    const galleryImages = [
      // غرف معيشة عصرية
      {
        title_ar: 'غرفة معيشة عصرية أنيقة',
        title_en: 'Elegant Modern Living Room',
        description_ar: 'تصميم عصري بألوان محايدة وإضاءة طبيعية',
        description_en: 'Modern design with neutral colors and natural lighting',
        imageURL: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        roomType: roomTypeIds[0], // Living Room
        designType: designTypeIds[0], // Modern
        album: 'مشروع الفيلا الحديثة'
      },
      {
        title_ar: 'صالة جلوس مودرن',
        title_en: 'Modern Lounge',
        description_ar: 'مساحة مفتوحة مع أثاث عصري',
        description_en: 'Open space with contemporary furniture',
        imageURL: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800',
        roomType: roomTypeIds[0],
        designType: designTypeIds[0],
        album: 'مشروع الفيلا الحديثة'
      },
      
      // غرف نوم كلاسيكية
      {
        title_ar: 'غرفة نوم رئيسية كلاسيكية',
        title_en: 'Classic Master Bedroom',
        description_ar: 'غرفة نوم فاخرة بتصميم كلاسيكي',
        description_en: 'Luxury bedroom with classic design',
        imageURL: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        roomType: roomTypeIds[1], // Bedroom
        designType: designTypeIds[1], // Classic
        album: 'مشروع القصر الكلاسيكي'
      },
      {
        title_ar: 'غرفة نوم ملكية',
        title_en: 'Royal Bedroom',
        description_ar: 'تصميم فخم بتفاصيل ذهبية',
        description_en: 'Luxurious design with golden details',
        imageURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        roomType: roomTypeIds[1],
        designType: designTypeIds[1],
        album: 'مشروع القصر الكلاسيكي'
      },

      // مطابخ مينيماليست
      {
        title_ar: 'مطبخ مينيماليست أبيض',
        title_en: 'White Minimalist Kitchen',
        description_ar: 'مطبخ بسيط وأنيق باللون الأبيض',
        description_en: 'Simple and elegant white kitchen',
        imageURL: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
        roomType: roomTypeIds[2], // Kitchen
        designType: designTypeIds[2], // Minimalist
        album: 'شقة المينيمال'
      },
      {
        title_ar: 'مطبخ عملي بسيط',
        title_en: 'Functional Simple Kitchen',
        description_ar: 'تصميم عملي بخطوط نظيفة',
        description_en: 'Functional design with clean lines',
        imageURL: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        roomType: roomTypeIds[2],
        designType: designTypeIds[2],
        album: 'شقة المينيمال'
      },

      // حمامات صناعية
      {
        title_ar: 'حمام صناعي حديث',
        title_en: 'Modern Industrial Bathroom',
        description_ar: 'حمام بتصميم صناعي مع لمسات معدنية',
        description_en: 'Industrial bathroom with metallic touches',
        imageURL: 'https://images.unsplash.com/photo-1564540579594-0930edb6de43?w=800',
        roomType: roomTypeIds[3], // Bathroom
        designType: designTypeIds[3], // Industrial
        album: 'لوفت صناعي'
      },
      {
        title_ar: 'حمام بتشطيبات خرسانية',
        title_en: 'Concrete Finish Bathroom',
        description_ar: 'حمام عصري بتشطيبات خرسانية',
        description_en: 'Modern bathroom with concrete finishes',
        imageURL: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
        roomType: roomTypeIds[3],
        designType: designTypeIds[3],
        album: 'لوفت صناعي'
      },

      // مكاتب اسكندنافية
      {
        title_ar: 'مكتب منزلي اسكندنافي',
        title_en: 'Scandinavian Home Office',
        description_ar: 'مكتب هادئ بتصميم اسكندنافي',
        description_en: 'Calm office with Scandinavian design',
        imageURL: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800',
        roomType: roomTypeIds[4], // Office
        designType: designTypeIds[4], // Scandinavian
        album: 'مكتب منزلي'
      },
      {
        title_ar: 'زاوية عمل مريحة',
        title_en: 'Cozy Work Corner',
        description_ar: 'مساحة عمل مريحة وعملية',
        description_en: 'Comfortable and functional workspace',
        imageURL: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
        roomType: roomTypeIds[4],
        designType: designTypeIds[4],
        album: 'مكتب منزلي'
      },

      // شرفات بوهيمية
      {
        title_ar: 'شرفة بوهيمية مريحة',
        title_en: 'Cozy Bohemian Balcony',
        description_ar: 'شرفة مزينة بنباتات وأقمشة ملونة',
        description_en: 'Balcony decorated with plants and colorful fabrics',
        imageURL: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        roomType: roomTypeIds[5], // Balcony
        designType: designTypeIds[5], // Bohemian
        album: 'شرفات مميزة'
      },
      {
        title_ar: 'جلسة خارجية بوهيمية',
        title_en: 'Bohemian Outdoor Seating',
        description_ar: 'مساحة خارجية مريحة للاسترخاء',
        description_en: 'Comfortable outdoor space for relaxation',
        imageURL: 'https://images.unsplash.com/photo-1522444690501-ecaf55fb0b56?w=800',
        roomType: roomTypeIds[5],
        designType: designTypeIds[5],
        album: 'شرفات مميزة'
      },

      // صور إضافية متنوعة
      {
        title_ar: 'غرفة طعام عصرية',
        title_en: 'Modern Dining Room',
        description_ar: 'غرفة طعام أنيقة بتصميم عصري',
        description_en: 'Elegant dining room with modern design',
        imageURL: 'https://images.unsplash.com/photo-1549637642-90187f64f420?w=800',
        roomType: roomTypeIds[0],
        designType: designTypeIds[0],
        album: 'غرف الطعام'
      },
      {
        title_ar: 'مدخل فاخر',
        title_en: 'Luxury Entrance',
        description_ar: 'مدخل رئيسي بتصميم فخم',
        description_en: 'Main entrance with luxurious design',
        imageURL: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
        roomType: roomTypeIds[0],
        designType: designTypeIds[1],
        album: 'المداخل'
      },
      {
        title_ar: 'غرفة أطفال ملونة',
        title_en: 'Colorful Kids Room',
        description_ar: 'غرفة أطفال مرحة بألوان زاهية',
        description_en: 'Cheerful kids room with bright colors',
        imageURL: 'https://images.unsplash.com/photo-1515516089376-88da9e0e0f5a?w=800',
        roomType: roomTypeIds[1],
        designType: designTypeIds[5],
        album: 'غرف الأطفال'
      },
      {
        title_ar: 'مطبخ مفتوح',
        title_en: 'Open Kitchen',
        description_ar: 'مطبخ مفتوح على الصالة',
        description_en: 'Kitchen open to the living area',
        imageURL: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
        roomType: roomTypeIds[2],
        designType: designTypeIds[0],
        album: 'المطابخ المفتوحة'
      },
      {
        title_ar: 'حمام رخامي',
        title_en: 'Marble Bathroom',
        description_ar: 'حمام فاخر بتشطيبات رخامية',
        description_en: 'Luxury bathroom with marble finishes',
        imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        roomType: roomTypeIds[3],
        designType: designTypeIds[1],
        album: 'حمامات فاخرة'
      },
      {
        title_ar: 'مكتبة منزلية',
        title_en: 'Home Library',
        description_ar: 'مكتبة منزلية بتصميم كلاسيكي',
        description_en: 'Home library with classic design',
        imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        roomType: roomTypeIds[4],
        designType: designTypeIds[1],
        album: 'المكتبات'
      },
      {
        title_ar: 'حديقة السطح',
        title_en: 'Rooftop Garden',
        description_ar: 'حديقة على السطح مع جلسة خارجية',
        description_en: 'Rooftop garden with outdoor seating',
        imageURL: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800',
        roomType: roomTypeIds[5],
        designType: designTypeIds[0],
        album: 'حدائق السطح'
      },
      {
        title_ar: 'غرفة ألعاب',
        title_en: 'Game Room',
        description_ar: 'غرفة ترفيهية للألعاب',
        description_en: 'Entertainment game room',
        imageURL: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
        roomType: roomTypeIds[0],
        designType: designTypeIds[3],
        album: 'غرف الترفيه'
      },
      {
        title_ar: 'غرفة ملابس',
        title_en: 'Walk-in Closet',
        description_ar: 'غرفة ملابس واسعة ومنظمة',
        description_en: 'Spacious and organized walk-in closet',
        imageURL: 'https://images.unsplash.com/photo-1558997519-83d741a58f84?w=800',
        roomType: roomTypeIds[1],
        designType: designTypeIds[2],
        album: 'غرف الملابس'
      },
      {
        title_ar: 'ركن القهوة',
        title_en: 'Coffee Corner',
        description_ar: 'ركن خاص لإعداد القهوة',
        description_en: 'Special corner for coffee preparation',
        imageURL: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
        roomType: roomTypeIds[2],
        designType: designTypeIds[4],
        album: 'أركان القهوة'
      }
    ];

    for (const image of galleryImages) {
      await run(
        `INSERT INTO gallery_images (
          title_ar, title_en, description_ar, description_en, 
          imageURL, roomType, designType, album, 
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          image.title_ar, image.title_en, 
          image.description_ar, image.description_en,
          image.imageURL, image.roomType, image.designType, image.album
        ]
      );
      console.log(`✅ Added image: ${image.title_en}`);
    }

    // 4. إضافة مستخدم أدمن افتراضي
    console.log('👤 Adding admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await run(
      'INSERT INTO users (username, password, createdAt) VALUES (?, ?, datetime("now"))',
      ['admin', hashedPassword]
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // 5. إضافة معلومات الاتصال الافتراضية
    console.log('📞 Adding contact information...');
    const contactData = {
      address: JSON.stringify([
        { ar: 'نابلس، شارع رفيديا، فلسطين', en: 'Nablus, Rafidia Street, Palestine' },
        { ar: 'رام الله، شارع الإرسال، فلسطين', en: 'Ramallah, Al-Irsal Street, Palestine' }
      ]),
      instagram: 'https://instagram.com/haladesign',
      facebook: 'https://facebook.com/haladesign',
      whatsapp: '+970599123456',
      otherLinks: JSON.stringify([
        { platform: { ar: 'بينترست', en: 'Pinterest' }, url: 'https://pinterest.com/haladesign' },
        { platform: { ar: 'يوتيوب', en: 'YouTube' }, url: 'https://youtube.com/@haladesign' }
      ])
    };

    await run(
      `INSERT INTO contact_info (
        address, instagram, facebook, whatsapp, otherLinks, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [contactData.address, contactData.instagram, contactData.facebook, 
       contactData.whatsapp, contactData.otherLinks]
    );
    console.log('✅ Contact information added');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📝 Login credentials: username: admin, password: admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// تشغيل السكريبت
seedDatabase();