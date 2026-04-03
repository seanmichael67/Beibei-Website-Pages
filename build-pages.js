#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// WordPress credentials
const WP_USER = 'luciano';
const WP_PASSWORD = 'ZjjW wlE4 tNJa 5sQr F6ym fLtV';
const WP_API = 'https://www.beibeiamigos.com/wp-json/wp/v2';
const AUTHOR_ID = 9;
const PARENT_PAGE_ID = 1714;

// Available hero images
const HERO_IMAGES = [
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/reading-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-african-boy-finger-painting-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/Beibei-Garden-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-dana-circle-time-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/Beibei-Pouring-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/Beibei-rubber-bands-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-kennedy-eyedropper-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-veronica-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540WB-3279.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540WB-3299.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540HB-3650-2.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540WB-3286.jpg'
];

const CLASSROOM_IMAGES = [
  'https://www.beibeiamigos.com/wp-content/uploads/2023/07/ChloeM.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2025/12/20250506_103302-scaled.jpg',
  'https://www.beibeiamigos.com/wp-content/uploads/2026/01/20250408_092238-scaled.jpg'
];

// Page configurations
const PAGES = [
  {
    name: 'Stetson Hills',
    slug: 'stetson-hills',
    zip: '85083',
    tier: 1,
    vibe: 'Master-planned, family-centric, hiking enthusiasts',
    schools: ['Stetson Hills School (A+)', 'Inspiration Mountain (STEAM)', 'Las Brisas Elementary'],
    landmarks: ['Deem Hills Recreation Area', 'Six Flags Hurricane Harbor'],
    mapOrigin: 'Deem Hills Recreation Area, Phoenix, AZ',
    hook: 'Your neighborhood partner for academic readiness before Stetson Hills or Inspiration Mountain.',
    neighborhoods: ['Stetson Hills', 'Adobe Highlands', 'Sonoran Foothills']
  },
  {
    name: 'City North',
    slug: 'city-north',
    zip: '85054',
    tier: 2,
    vibe: 'Corporate professionals, convenience-focused',
    schools: ['Feeds into Pinnacle High area'],
    landmarks: ['High Street Corporate Offices', 'Desert Ridge East'],
    mapOrigin: 'High Street, Phoenix, AZ 85054',
    hook: 'The most convenient premium preschool for High Street executives.',
    neighborhoods: ['City North', 'High Street', 'Desert Ridge East']
  },
  {
    name: 'Deer Valley',
    slug: 'deer-valley',
    zip: '85027',
    tier: 3,
    vibe: 'Commuter families, established neighborhoods',
    schools: ['Deer Valley High School', 'Barry Goldwater High School'],
    landmarks: ['Deer Valley Airport'],
    mapOrigin: 'Deer Valley Airport, Phoenix, AZ',
    hook: 'Language pipeline for commuter families seeking world-class early education.',
    neighborhoods: ['Deer Valley', 'Happy Valley', 'New River']
  },
  {
    name: 'Desert Ridge North',
    slug: 'desert-ridge-north',
    zip: '85024',
    tier: 2,
    vibe: 'Medical professionals, quality-focused families',
    schools: ['Desert Springs Preparatory'],
    landmarks: ['Reach 11 Sports Complex', 'Mayo Clinic Hospital'],
    mapOrigin: 'Mayo Clinic Hospital, Phoenix, AZ 85054',
    hook: 'Serving the medical professionals of Mayo Clinic with world-class trilingual education.',
    neighborhoods: ['Desert Ridge', 'Grovers', 'Tatum Highlands']
  },
  {
    name: 'Moon Valley Central',
    slug: 'moon-valley-central',
    zip: '85023',
    tier: 3,
    vibe: 'Established neighborhoods, community-focused',
    schools: ['Lookout Mountain Elementary'],
    landmarks: ['Moon Valley Park'],
    mapOrigin: 'Moon Valley Park, Phoenix, AZ',
    hook: 'Bringing trilingual Montessori excellence to the heart of Moon Valley.',
    neighborhoods: ['Moon Valley', 'North Mountain Village']
  },
  {
    name: 'Moon Valley South',
    slug: 'moon-valley-south',
    zip: '85022',
    tier: 3,
    vibe: 'Established neighborhoods, upscale',
    schools: ['Moon Mountain Elementary'],
    landmarks: ['Moon Valley Country Club'],
    mapOrigin: 'Moon Valley Country Club, Phoenix, AZ',
    hook: 'Premium Montessori education for discerning Moon Valley families.',
    neighborhoods: ['Moon Valley', 'Country Club Estates']
  },
  {
    name: 'North Central Phoenix',
    slug: 'north-central-phoenix',
    zip: '85021',
    tier: 3,
    vibe: 'Central location, diverse families',
    schools: ['Orangewood Elementary', 'Washington Elementary'],
    landmarks: ['Cortez Park'],
    mapOrigin: 'Cortez Park, Phoenix, AZ',
    hook: 'Centrally located trilingual Montessori for North Central Phoenix families.',
    neighborhoods: ['North Central Phoenix', 'Sunnyslope']
  },
  {
    name: 'North Glendale',
    slug: 'north-glendale',
    zip: '85306',
    tier: 2,
    vibe: 'Medical professionals, working families',
    schools: ['Bellair Elementary (Science Focus)', 'Copper Creek'],
    landmarks: ['Banner Thunderbird Medical Center'],
    mapOrigin: 'Banner Thunderbird Medical Center, Glendale, AZ',
    hook: 'Trusted care for Banner Health nurses and doctors seeking trilingual excellence.',
    neighborhoods: ['North Glendale', 'Thunderbird Estates']
  },
  {
    name: 'North Mountain',
    slug: 'north-mountain',
    zip: '85020',
    tier: 3,
    vibe: 'Outdoor enthusiasts, active families',
    schools: ['Sunnyslope High School', 'Madison Meadows'],
    landmarks: ['North Mountain Park', 'Pointe Hilton Tapatio Cliffs'],
    mapOrigin: 'North Mountain Park, Phoenix, AZ',
    hook: 'Where academic excellence meets outdoor adventure for North Mountain families.',
    neighborhoods: ['North Mountain', 'Sunnyslope', 'Pointe Tapatio']
  },
  {
    name: 'North Phoenix',
    slug: 'north-phoenix',
    zip: '85051',
    tier: 3,
    vibe: 'Redevelopment area, growing families',
    schools: ['Acacia Elementary', 'Washington High School'],
    landmarks: ['Metro Center Redevelopment (The Villages)'],
    mapOrigin: 'Metro Center, Phoenix, AZ',
    hook: 'Serving North Phoenix families with rigorous trilingual Montessori education.',
    neighborhoods: ['North Phoenix', 'Metro Center', 'The Villages']
  },
  {
    name: 'Sunnyslope',
    slug: 'sunnyslope',
    zip: '85020',
    tier: 3,
    vibe: 'Diverse, inclusive, academically focused',
    schools: ['Sunnyslope High School (Top Rated)', 'Madison Meadows'],
    landmarks: ['Pointe Hilton Tapatio Cliffs', 'North Mountain Park'],
    mapOrigin: 'Sunnyslope High School, Phoenix, AZ',
    hook: 'Diverse, inclusive, and academically rigorous preparation for global citizenship.',
    neighborhoods: ['Sunnyslope', 'North Mountain Village']
  },
  {
    name: 'West Moon Valley',
    slug: 'west-moon-valley',
    zip: '85029',
    tier: 3,
    vibe: 'Family-oriented, education-focused',
    schools: ['Thunderbird High School', 'Marshall Ranch'],
    landmarks: ['ASU West Valley Campus'],
    mapOrigin: 'ASU West Valley, Glendale, AZ',
    hook: 'Connecting West Moon Valley families with world-class language immersion.',
    neighborhoods: ['West Moon Valley', 'Thunderbird Palms']
  }
];

// Helper function for HTTPS requests
function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Check if page exists
async function checkPageExists(slug) {
  const url = new URL(`${WP_API}/pages`);
  url.searchParams.append('slug', slug);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64'),
      'User-Agent': 'WordPress/6.0'
    }
  };
  
  const result = await httpsRequest(options);
  return result.data.length > 0 ? result.data[0] : null;
}

// Create or update WordPress page
async function publishPage(pageConfig, content) {
  const existing = await checkPageExists(pageConfig.slug);
  
  if (existing) {
    // Update existing page
    console.log(`  → Updating existing page (ID: ${existing.id})...`);
    const url = new URL(`${WP_API}/pages/${existing.id}`);
    
    const pageData = {
      title: `${pageConfig.name} (${pageConfig.zip}) | Beibei Amigos Montessori Preschool`,
      content: `[et_pb_section][et_pb_row][et_pb_column type="4_4"][et_pb_code]${content}[/et_pb_code][/et_pb_column][/et_pb_row][/et_pb_section]`,
      status: 'publish',
      author: AUTHOR_ID,
      parent: PARENT_PAGE_ID,
      meta: {
        _yoast_wpseo_metadesc: `Premier trilingual Montessori preschool for ${pageConfig.name} families (${pageConfig.zip}). Mandarin & Spanish immersion preparing for Kindergarten. Tour today!`,
        _yoast_wpseo_canonical: `https://www.beibeiamigos.com/communities/${pageConfig.slug}/`
      }
    };
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64'),
        'User-Agent': 'WordPress/6.0'
      }
    };
    
    const result = await httpsRequest(options, pageData);
    return result;
  } else {
    // Create new page (two-step to avoid ModSecurity)
    console.log(`  → Creating new draft page...`);
    
    // Step 1: Create minimal draft
    const createUrl = new URL(`${WP_API}/pages`);
    const draftData = {
      title: `${pageConfig.name} (${pageConfig.zip}) | Beibei Amigos Montessori Preschool`,
      slug: pageConfig.slug,
      status: 'draft',
      author: AUTHOR_ID,
      parent: PARENT_PAGE_ID,
      content: 'Loading...'
    };
    
    const createOptions = {
      hostname: createUrl.hostname,
      path: createUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64'),
        'User-Agent': 'WordPress/6.0'
      }
    };
    
    const createResult = await httpsRequest(createOptions, draftData);
    
    if (createResult.status < 200 || createResult.status >= 300) {
      return createResult;
    }
    
    const newPageId = createResult.data.id;
    console.log(`  → Draft created (ID: ${newPageId}), updating with full content...`);
    
    // Step 2: Update with full content and publish
    const updateUrl = new URL(`${WP_API}/pages/${newPageId}`);
    const updateData = {
      content: `[et_pb_section][et_pb_row][et_pb_column type="4_4"][et_pb_code]${content}[/et_pb_code][/et_pb_column][/et_pb_row][/et_pb_section]`,
      status: 'publish',
      meta: {
        _yoast_wpseo_metadesc: `Premier trilingual Montessori preschool for ${pageConfig.name} families (${pageConfig.zip}). Mandarin & Spanish immersion preparing for Kindergarten. Tour today!`,
        _yoast_wpseo_canonical: `https://www.beibeiamigos.com/communities/${pageConfig.slug}/`
      }
    };
    
    const updateOptions = {
      hostname: updateUrl.hostname,
      path: updateUrl.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64'),
        'User-Agent': 'WordPress/6.0'
      }
    };
    
    const result = await httpsRequest(updateOptions, updateData);
    return result;
  }
}

// Add to navigation menu
async function addToMenu(pageConfig, pageId) {
  const url = new URL(`${WP_API}/menu-items`);
  
  const menuData = {
    title: pageConfig.name,
    url: `https://www.beibeiamigos.com/communities/${pageConfig.slug}/`,
    menus: 4,
    parent: 1720,
    status: 'publish',
    object_id: pageId,
    object: 'page',
    type: 'post_type'
  };
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64'),
      'User-Agent': 'WordPress/6.0'
    }
  };
  
  const result = await httpsRequest(options, menuData);
  return result;
}

// Generate customized HTML content
function generatePageContent(pageConfig, index) {
  const heroImage = HERO_IMAGES[index % HERO_IMAGES.length];
  const classroomImage = CLASSROOM_IMAGES[index % CLASSROOM_IMAGES.length];
  
  const neighborhoodList = pageConfig.neighborhoods.join(', ');
  const areaServedJson = pageConfig.neighborhoods.map(n => `{ "@type": "Neighborhood", "name": "${n}" }`).join(',\n        ');
  
  const immersionCallout = pageConfig.tier === 1 ? `
        <!-- Immersion Pipeline Callout -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-6 max-w-4xl">
                <div class="immersion-pipeline text-center">
                    <div class="relative z-10">
                        <div class="flex justify-center mb-4">
                            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                                <i class="fas fa-graduation-cap text-3xl text-blue-900"></i>
                            </div>
                        </div>
                        <h2 class="text-3xl font-bold mb-4" style="color: white !important; font-family: 'Montserrat', sans-serif !important;">The Immersion Pipeline</h2>
                        <p class="text-yellow-300 font-semibold text-lg mb-4">Beibei Amigos → Arizona Language Preparatory (ALP)</p>
                        <p class="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                            Beibei Amigos is <strong class="text-white">the #1 preschool feeder</strong> for Arizona Language Preparatory's acclaimed K-6 Mandarin and Spanish immersion program. Our ${pageConfig.name} graduates arrive at ALP with years of trilingual immersion experience, giving them an unmatched advantage from day one.
                        </p>
                        <div class="grid md:grid-cols-3 gap-6 mt-8">
                            <div class="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                                <i class="fas fa-baby text-yellow-400 text-2xl mb-2"></i>
                                <h4 class="font-bold text-white text-sm">Ages 1-5</h4>
                                <p class="text-blue-200 text-xs">Beibei Amigos trilingual immersion foundation</p>
                            </div>
                            <div class="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                                <i class="fas fa-arrow-right text-yellow-400 text-2xl mb-2"></i>
                                <h4 class="font-bold text-white text-sm">Kindergarten Ready</h4>
                                <p class="text-blue-200 text-xs">Seamless transition with language confidence</p>
                            </div>
                            <div class="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                                <i class="fas fa-school text-yellow-400 text-2xl mb-2"></i>
                                <h4 class="font-bold text-white text-sm">ALP K-6</h4>
                                <p class="text-blue-200 text-xs">Mandarin & Spanish immersion excellence</p>
                            </div>
                        </div>
                        <p class="text-blue-200 text-sm mt-6 italic">Also preparing ${pageConfig.name} students for Sequoya Elementary and Horizon High School</p>
                    </div>
                </div>
            </div>
        </section>
` : '';

  return `<style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;600&display=swap');
        
        #et-main-area, .et_pb_section, .et_pb_row, .et_pb_column {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
        }
        
        .landing-page-root {
            width: 100vw;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
            overflow-x: hidden;
            font-family: 'Open Sans', sans-serif !important;
            line-height: 1.5;
            color: #374151 !important;
            background-color: #ffffff !important;
        }

        .landing-page-root h1, 
        .landing-page-root h2, 
        .landing-page-root h3, 
        .landing-page-root h4 {
            font-family: 'Montserrat', sans-serif !important;
            margin-top: 0 !important;
        }

        .hero-section { 
            position: relative; 
            height: 600px;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            text-align: center; 
            color: white !important; 
            background-color: #333;
            background-image: url('${heroImage}');
            background-size: cover;
            background-position: center;
            overflow: hidden;
        }
        
        .hero-video { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            min-width: 100%; 
            min-height: 100%; 
            width: auto; 
            height: auto; 
            z-index: 0; 
            transform: translateX(-50%) translateY(-35%);
            object-fit: cover; 
        }
        
        .hero-overlay { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0, 0, 0, 0.5); 
            z-index: 1; 
        }
        
        .hero-content { 
            position: relative; 
            z-index: 2; 
            width: 100%;
            max-width: 1200px;
            padding: 0 20px;
        }

        .map-container iframe { width: 100%; height: 100%; border: 0; }

        /* Immersion Pipeline Callout */
        .immersion-pipeline {
            background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
            border: 3px solid #fbbf24;
            border-radius: 1rem;
            padding: 2rem;
            color: white;
            position: relative;
            overflow: hidden;
        }
        .immersion-pipeline::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%);
        }

        @media (max-width: 768px) {
            .landing-page-root {
                width: 100% !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                left: 0 !important;
                right: 0 !important;
            }
            
            .hero-section {
                height: 550px !important; 
            }

            .hero-content h1 {
                font-size: 1.8rem !important;
                line-height: 1.2 !important;
                margin-bottom: 1rem !important;
            }

            .hero-content p {
                font-size: 1rem !important;
                line-height: 1.4 !important;
                margin-bottom: 1.5rem !important;
            }
            
            .flex-col-mobile {
                flex-direction: column !important;
                gap: 15px !important;
            }
            
            .mobile-btn {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
            }
        }
    </style>

    <!-- JSON-LD Schema: Preschool -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "name": "Beibei Amigos Language Preschool",
      "image": "https://www.beibeiamigos.com/wp-content/uploads/2023/12/logo.png",
      "@id": "https://www.beibeiamigos.com",
      "url": "https://www.beibeiamigos.com",
      "telephone": "+16029964990",
      "email": "admin@beibeiamigos.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "751 E. Union Hills Drive",
        "addressLocality": "Phoenix",
        "addressRegion": "AZ",
        "postalCode": "85024",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 33.655,
        "longitude": -112.065
      },
      "areaServed": [
        { "@type": "PostalCode", "postalCode": "${pageConfig.zip}" },
        ${areaServedJson}
      ],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "33",
        "bestRating": "5",
        "worstRating": "1"
      },
      "description": "Montessori preschool serving ${pageConfig.name} (${pageConfig.zip}) families with Spanish and Mandarin immersion. ${pageConfig.hook}"
    }
    </script>
    
    <!-- JSON-LD Schema: FAQ -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "What ages do you accept at Beibei Amigos?",
        "acceptedAnswer": { "@type": "Answer", "text": "We welcome toddlers (1 year walking to 2 years old) and preschoolers (3 to 5 years old). All programs feature full language immersion in Spanish, Mandarin, and English." }
      }, {
        "@type": "Question",
        "name": "Is Beibei Amigos a Montessori school or a daycare?",
        "acceptedAnswer": { "@type": "Answer", "text": "We are a comprehensive Early Childhood Education (ECE) center, offering more than just daycare services. We provide both Montessori and Traditional curriculums with a focus on Kindergarten readiness." }
      }, {
        "@type": "Question",
        "name": "What languages are taught?",
        "acceptedAnswer": { "@type": "Answer", "text": "We provide 100% language immersion in Spanish, Mandarin Chinese, and English—preparing children for a global future." }
      }, {
        "@type": "Question",
        "name": "How does Beibei Amigos prepare children for elementary school?",
        "acceptedAnswer": { "@type": "Answer", "text": "Our trilingual curriculum builds the language foundation and academic readiness that ${pageConfig.schools[0]} and other top schools expect, giving your child a significant advantage on day one." }
      }, {
        "@type": "Question",
        "name": "Do you offer part-time schedules?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, families may select from 3 half days up to 5 full days per week. We partner with you to design a flexible schedule." }
      }, {
        "@type": "Question",
        "name": "Do you accept DES child care assistance?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, we are a DES-certified provider. We accept Department of Economic Security (DES) assistance to help eligible families with tuition costs." }
      }]
    }
    </script>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>

    <div class="landing-page-root">
        <!-- Hero Section -->
        <header class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white !important drop-shadow-lg" style="color: #ffffff !important;">Trilingual Montessori Preschool for ${pageConfig.name} Families</h1>
                <p class="text-xl md:text-2xl mb-8 font-light text-white !important drop-shadow-md" style="color: #ffffff !important;">Serving ${neighborhoodList}. ${pageConfig.hook}</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-col-mobile">
                    <a href="https://beibeiamigos.youcanbook.me/" target="_blank" class="bg-red-500 hover:bg-red-600 text-white text-xl px-10 py-4 rounded-full font-bold shadow-xl transition transform hover:scale-105 flex items-center justify-center !important no-underline mobile-btn" style="color: white !important;">
                        <i class="fas fa-calendar-check mr-3"></i> Book a Tour
                    </a>
                    <a href="tel:6029964990" class="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-4 rounded-full font-bold shadow-xl transition transform hover:scale-105 flex items-center justify-center !important no-underline mobile-btn" style="color: white !important;">
                        <i class="fas fa-phone mr-3"></i> Call School
                    </a>
                </div>
                <div class="inline-block bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-3 mt-4">
                    <p class="text-sm font-medium text-white mb-1" style="color: white !important;"><i class="fas fa-map-marker-alt mr-2 text-red-400"></i> Convenient to ${pageConfig.zip} &amp; ${pageConfig.name}</p>
                    <p class="text-xs text-gray-200" style="color: #e5e7eb !important;">Quick access from ${pageConfig.landmarks[0]}</p>
                </div>
            </div>
        </header>

        <!-- Trust Indicators -->
        <section class="py-12 bg-white border-b border-gray-100">
            <div class="container mx-auto px-6 text-center max-w-7xl">
                <p class="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-8">Trusted by Families in ${pageConfig.name} &amp; Surrounding Areas</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
                    <div class="flex flex-col items-center">
                        <span class="text-5xl font-extrabold text-blue-600 mb-2">3</span>
                        <span class="text-lg font-bold text-gray-700 uppercase tracking-wide">Languages</span>
                    </div>
                    <div class="flex flex-col items-center border-l-0 md:border-l md:border-r border-gray-200">
                        <span class="text-5xl font-extrabold text-blue-600 mb-2">18+</span>
                        <span class="text-lg font-bold text-gray-700 uppercase tracking-wide">Years Experience</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-5xl font-extrabold text-blue-600 mb-2">100%</span>
                        <span class="text-lg font-bold text-gray-700 uppercase tracking-wide">Language Immersion</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Google Reviews -->
        <section class="py-16 bg-blue-600 text-white" id="reviews">
            <div class="container mx-auto px-6 max-w-7xl">
                <div class="flex flex-col items-center justify-center mb-10">
                    <div class="flex items-center mb-4">
                        <i class="fab fa-google text-3xl mr-3 text-white !important"></i>
                        <h2 class="text-3xl font-bold text-center text-white !important" style="color: white !important;">What ${pageConfig.name} Parents Are Saying</h2>
                    </div>
                    <div class="flex flex-wrap justify-center items-center bg-blue-800 bg-opacity-50 px-6 py-2 rounded-full border border-blue-400">
                        <span class="text-yellow-400 text-xl mr-2">★★★★½</span>
                        <span class="font-bold text-lg mr-2 text-white" style="color: white !important;">4.5/5</span>
                        <span class="text-sm opacity-90 text-white" style="color: white !important;">Average Customer Rating (33 Reviews)</span>
                    </div>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-blue-700 p-8 rounded-xl shadow-lg relative">
                        <div class="flex text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="italic mb-6 text-blue-100">"BeiBei Amigos is truly a gem of a daycare and school! From the moment we stepped in, we were embraced by the warm, caring environment that makes both children and parents feel at home."</p>
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold mr-3" style="color: white !important;">AP</div>
                            <div><p class="font-bold" style="color: white !important;">Ashley Parkinson</p><p class="text-xs text-blue-200">Google Review</p></div>
                        </div>
                    </div>
                    <div class="bg-blue-700 p-8 rounded-xl shadow-lg relative">
                        <div class="flex text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="italic mb-6 text-blue-100">"Bei Bei Amigos is a wonderful school to send your children. Both of my kids went there and learned Spanish and Mandarin. The multilingual education is incredible!"</p>
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold mr-3" style="color: white !important;">CK</div>
                            <div><p class="font-bold" style="color: white !important;">Crystal Keith</p><p class="text-xs text-blue-200">Google Review</p></div>
                        </div>
                    </div>
                    <div class="bg-blue-700 p-8 rounded-xl shadow-lg relative">
                        <div class="flex text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="italic mb-6 text-blue-100">"We have had the best experience here! My toddler is speaking other languages at home and it is incredible!!! The language immersion really works."</p>
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold mr-3" style="color: white !important;">CK</div>
                            <div><p class="font-bold" style="color: white !important;">Courtney Knotts</p><p class="text-xs text-blue-200">Google Review</p></div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-10">
                    <a href="https://g.page/r/CWBJbgYgiI-wEBE/review" target="_blank" class="text-blue-100 hover:text-white underline text-sm">Read more reviews on Google Maps</a>
                </div>
            </div>
        </section>

        <!-- Introduction Video -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-6 max-w-4xl text-center">
                <h2 class="text-3xl font-bold text-gray-900 mb-8">Meet The Founder</h2>
                <div class="video-player-wrapper relative" style="padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <iframe src="https://www.youtube.com/embed/YOUR_YOUTUBE_ID_HERE?rel=0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <p class="text-gray-500 mt-4 italic">Step inside our classrooms and see how natural immersion happens.</p>
            </div>
        </section>

        <!-- Vision Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center gap-12">
                <div class="md:w-1/2">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Vision for ${pageConfig.name} Global Citizens</h2>
                    <h3 class="text-xl font-semibold text-blue-600 mb-4">Founded by Sean Michael Diana</h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        ${pageConfig.name} is home to families who value quality education and global perspective. Founder Sean Michael Diana created Beibei Amigos 18 years ago with a mission to provide the kind of rigorous, globally-minded education that discerning families expect. ${pageConfig.hook}
                    </p>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        By introducing Mandarin, Spanish, and English during the brain's most plastic years, we equip ${pageConfig.name} children with the cultural empathy and cognitive tools needed to thrive in an interconnected world. Our graduates are prepared for the academic rigor of ${pageConfig.schools[0]} and beyond.
                    </p>
                </div>
                <div class="md:w-1/2">
                    <img src="${classroomImage}" alt="Beibei Amigos Classroom" class="rounded-xl shadow-lg w-full object-cover h-80">
                </div>
            </div>
        </section>

        <!-- Key Details -->
        <section class="py-12 bg-white">
            <div class="container mx-auto px-6 max-w-7xl">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-gray-900">Program Details At A Glance</h2>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex items-start">
                        <div class="flex-shrink-0 mr-4"><div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><i class="fas fa-users text-xl"></i></div></div>
                        <div><h3 class="text-lg font-bold text-blue-600 mb-2">Ages</h3><p class="text-sm text-gray-600 leading-relaxed">We welcome <span class="font-semibold text-blue-600">toddlers (1 year walking to 2 years old)</span> and <span class="font-semibold text-blue-600">preschoolers (3 to 5 years old)</span>. All programs feature full language immersion.</p></div>
                    </div>
                    <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex items-start">
                        <div class="flex-shrink-0 mr-4"><div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><i class="fas fa-clock text-xl"></i></div></div>
                        <div><h3 class="text-lg font-bold text-green-600 mb-2">Hours</h3><p class="text-sm text-gray-600 mb-2">Open <span class="font-semibold text-green-600">7:00 AM – 6:00 PM</span>. Core academics: 9:00 AM – 4:00 PM.</p></div>
                    </div>
                    <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex items-start">
                        <div class="flex-shrink-0 mr-4"><div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><i class="fas fa-star text-xl"></i></div></div>
                        <div><h3 class="text-lg font-bold text-blue-600 mb-2">Flexible Schedule</h3><p class="text-sm text-gray-600 mb-2">Choose from <span class="font-semibold text-blue-600">3 half days up to 5 full days</span> per week.</p></div>
                    </div>
                    <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex items-start">
                        <div class="flex-shrink-0 mr-4"><div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><i class="fas fa-calendar-alt text-xl"></i></div></div>
                        <div><h3 class="text-lg font-bold text-green-600 mb-2">Calendar</h3><p class="text-sm text-gray-600 leading-relaxed">Open year round, only closed on <span class="font-semibold text-green-600">national holidays</span>.</p></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Programs Section -->
        <section class="py-16 bg-white" id="programs">
            <div class="container mx-auto px-6 max-w-7xl">
                <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">Beibei Amigos Trilingual Programs</h2>
                <p class="text-center text-gray-600 max-w-2xl mx-auto mb-12">Carefully structured programs that grow with your child, ensuring optimal language development at every stage.</p>
                
                <div class="grid md:grid-cols-2 gap-12 items-start">
                    <!-- Traditional Program -->
                    <div class="bg-blue-50 rounded-2xl p-8 border border-blue-100 h-full flex flex-col">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-sm">T</div>
                            <div>
                                <h3 class="text-2xl font-bold text-gray-800">Traditional Program</h3>
                                <p class="text-blue-600 font-semibold">Play-Based Learning</p>
                            </div>
                        </div>
                        
                        <div class="mb-6 text-sm text-gray-700 space-y-2 bg-white p-4 rounded-lg shadow-sm">
                            <p class="flex items-center"><i class="fas fa-user-friends text-blue-400 mr-2 w-5 text-center"></i> <strong>Toddlers:</strong> 1 year (walking) - 2 years</p>
                            <p class="flex items-center"><i class="fas fa-child text-blue-400 mr-2 w-5 text-center"></i> <strong>Preschool:</strong> 3 - 5 years</p>
                            <p class="flex items-center"><i class="fas fa-clock text-blue-400 mr-2 w-5 text-center"></i> Full and Half Days Available</p>
                        </div>

                        <p class="mb-6 text-gray-600">Our traditional program uses play-based learning to naturally immerse children in Spanish and Mandarin while building essential skills through exploration and creativity. This <strong>Pre-K</strong> pathway focuses on early socialization and learning.</p>
                        
                        <h4 class="font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">Program Highlights:</h4>
                        <ul class="space-y-3 mb-8 text-sm text-gray-700 flex-grow">
                            <li class="flex items-start"><i class="fas fa-music text-blue-500 mt-1 mr-3"></i> <span>Spanish & Mandarin immersion through songs, stories, and games</span></li>
                            <li class="flex items-start"><i class="fas fa-shapes text-blue-500 mt-1 mr-3"></i> <span>Play-based curriculum building social, emotional, and academic skills</span></li>
                            <li class="flex items-start"><i class="fas fa-paint-brush text-blue-500 mt-1 mr-3"></i> <span>Hands-on projects that spark creativity and curiosity</span></li>
                            <li class="flex items-start"><i class="fas fa-book-open text-blue-500 mt-1 mr-3"></i> <span>Early literacy and language arts in three languages through play centers</span></li>
                            <li class="flex items-start"><i class="fas fa-puzzle-piece text-blue-500 mt-1 mr-3"></i> <span>Math concepts introduced with puzzles, manipulatives, and group activities</span></li>
                            <li class="flex items-start"><i class="fas fa-globe-americas text-blue-500 mt-1 mr-3"></i> <span>Cultural exploration with music, art, and dramatic play</span></li>
                            <li class="flex items-start"><i class="fas fa-users text-blue-500 mt-1 mr-3"></i> <span>Leadership opportunities through classroom jobs and collaborative play</span></li>
                        </ul>
                    </div>

                    <!-- Montessori Program -->
                    <div class="bg-green-50 rounded-2xl p-8 border border-green-100 h-full flex flex-col">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-sm">M</div>
                            <div>
                                <h3 class="text-2xl font-bold text-gray-800">Montessori Program</h3>
                                <p class="text-green-600 font-semibold">The Five Areas of Learning</p>
                            </div>
                        </div>

                        <div class="mb-6 text-sm text-gray-700 space-y-2 bg-white p-4 rounded-lg shadow-sm">
                            <p class="flex items-center"><i class="fas fa-user-friends text-green-500 mr-2 w-5 text-center"></i> <strong>Toddlers:</strong> 1 year (walking) - 2 years</p>
                            <p class="flex items-center"><i class="fas fa-child text-green-500 mr-2 w-5 text-center"></i> <strong>Preschool:</strong> 3 - 5 years</p>
                            <p class="flex items-center"><i class="fas fa-clock text-green-500 mr-2 w-5 text-center"></i> Full and Half Days Available</p>
                        </div>

                        <p class="mb-6 text-gray-600">Our Montessori program follows Maria Montessori's philosophy with full language immersion in Spanish, Mandarin, and English. Perfect for <strong>Kindergarten readiness</strong>.</p>
                        
                        <h4 class="font-bold text-green-800 mb-4 border-b border-green-200 pb-2">Program Highlights:</h4>
                        <ul class="space-y-3 mb-8 text-sm text-gray-700 flex-grow">
                            <li class="flex items-start"><i class="fas fa-hands-wash text-green-600 mt-1 mr-3"></i> <span><strong>Practical Life:</strong> Children build independence and confidence through self-care routines, food preparation, and care of the classroom environment</span></li>
                            <li class="flex items-start"><i class="fas fa-fingerprint text-green-600 mt-1 mr-3"></i> <span><strong>Sensorial:</strong> Materials develop the senses by exploring shapes, colors, textures, and patterns, forming the foundation for math and science</span></li>
                            <li class="flex items-start"><i class="fas fa-comments text-green-600 mt-1 mr-3"></i> <span><strong>Language:</strong> Immersion in Spanish, Mandarin, and English with phonetic materials, vocabulary development, and storytelling</span></li>
                            <li class="flex items-start"><i class="fas fa-calculator text-green-600 mt-1 mr-3"></i> <span><strong>Mathematics:</strong> Hands-on Montessori math materials introduce counting, number sense, place value, and operations</span></li>
                            <li class="flex items-start"><i class="fas fa-globe text-green-600 mt-1 mr-3"></i> <span><strong>Cultural Studies:</strong> Geography, science, and global awareness brought to life through maps, globes, nature studies, and cultural celebrations</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="py-16 bg-gray-50" id="faq">
            <div class="container mx-auto px-6 max-w-7xl">
                <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="font-bold text-lg text-blue-800 mb-2">What ages do you accept?</h3><p class="text-gray-600">We welcome toddlers (1 year walking) to preschoolers (5 years).</p></div>
                    <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="font-bold text-lg text-blue-800 mb-2">Is it a Montessori or Daycare?</h3><p class="text-gray-600">We are a comprehensive ECE center offering both Montessori and Traditional curriculums.</p></div>
                    <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="font-bold text-lg text-blue-800 mb-2">What languages are taught?</h3><p class="text-gray-600">We provide 100% immersion in Spanish, Mandarin Chinese, and English.</p></div>
                    <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="font-bold text-lg text-blue-800 mb-2">Do you offer part-time?</h3><p class="text-gray-600">Yes, select from 3 half days up to 5 full days per week.</p></div>
                    <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="font-bold text-lg text-blue-800 mb-2">How far from ${pageConfig.name}?</h3><p class="text-gray-600">Conveniently located near ${pageConfig.landmarks[0]}, just a short drive to 751 E Union Hills Drive, Phoenix 85024.</p></div>
                    <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="font-bold text-lg text-blue-800 mb-2">Do you accept DES assistance?</h3><p class="text-gray-600">Yes, we are DES-certified and accept child care assistance for eligible families.</p></div>
                </div>
            </div>
        </section>

${immersionCallout}

        <!-- Book a Tour -->
        <section class="py-16 bg-blue-600 text-white" id="book-tour">
            <div class="container mx-auto px-6 max-w-4xl text-center">
                <h2 class="text-3xl font-bold mb-6 text-white !important">See The Difference for Yourself</h2>
                <p class="text-xl opacity-90 mb-10 text-white !important">We invite ${pageConfig.name} families to tour our campus and meet our trilingual educators.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4 flex-col-mobile">
                    <a href="https://beibeiamigos.youcanbook.me/" target="_blank" class="bg-white text-blue-600 text-xl px-10 py-4 rounded-full font-bold shadow-xl transition transform hover:scale-105 inline-flex items-center justify-center !important no-underline mobile-btn" style="color: #2563eb !important;">
                        <i class="fas fa-calendar-check mr-3"></i> Book a Private Tour
                    </a>
                    <a href="tel:6029964990" class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-xl px-10 py-4 rounded-full font-bold shadow-xl transition transform hover:scale-105 inline-flex items-center justify-center !important no-underline mobile-btn" style="color: white !important;">
                        <i class="fas fa-phone mr-3"></i> Call School
                    </a>
                </div>
            </div>
        </section>

        <!-- SEO Content -->
        <section class="py-16 bg-blue-50 border-t border-blue-100">
            <div class="container mx-auto px-6 max-w-5xl">
                <div class="text-left">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Montessori Preschool Serving ${pageConfig.name} (${pageConfig.zip})</h2>
                    <p class="text-lg text-gray-700 font-medium mb-6 italic border-l-4 border-blue-500 pl-4 bg-white p-4 rounded shadow-sm">
                        "${pageConfig.name} families deserve world-class early childhood education. Beibei Amigos is proud to be the premier trilingual preschool choice for discerning families across the ${pageConfig.zip} zip code."
                    </p>
                    <h3 class="text-xl font-bold text-blue-600 mb-4">Why ${pageConfig.name} Parents Choose Beibei Amigos</h3>
                    <ul class="space-y-3 mb-8 text-gray-600">
                        <li class="flex items-start"><i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i> <span><strong>School Readiness:</strong> Preparing students for the academic rigor of ${pageConfig.schools[0]} and beyond.</span></li>
                        <li class="flex items-start"><i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i> <span><strong>Convenient Location:</strong> Easy access from ${pageConfig.landmarks.join(', ')}.</span></li>
                        <li class="flex items-start"><i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i> <span><strong>Flexible Hours:</strong> Full-day programs (7am–6pm) designed for working ${pageConfig.name} parents.</span></li>
                        <li class="flex items-start"><i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i> <span><strong>Trilingual Advantage:</strong> 100% immersion in Mandarin, Spanish, and English—skills for life.</span></li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Map Section -->
        <section class="py-16 bg-white" id="location">
            <div class="container mx-auto px-6 max-w-7xl">
                <h2 class="text-3xl font-bold text-center text-gray-900 mb-8" style="font-family: 'Montserrat', sans-serif !important;">Find Our Campus</h2>
                
                <div class="relative w-full h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <iframe 
                        src="https://maps.google.com/maps?saddr=${encodeURIComponent(pageConfig.mapOrigin)}&daddr=751+E+Union+Hills+Drive,+Phoenix,+AZ+85024&output=embed" 
                        width="100%" 
                        height="100%" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                    <div class="absolute bottom-6 left-6 bg-white p-5 rounded-lg shadow-xl max-w-xs hidden md:block border-l-4 border-blue-500">
                        <p class="font-bold text-gray-900 flex items-center mb-1"><i class="fas fa-car text-blue-500 mr-2"></i> Quick Drive from ${pageConfig.name}</p>
                        <p class="text-xs text-gray-600">Convenient access from ${pageConfig.landmarks[0]}</p>
                    </div>
                </div>

                <div class="text-center mt-8">
                    <a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pageConfig.mapOrigin)}&destination=751+E+Union+Hills+Dr,+Phoenix,+AZ+85024" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-4 rounded-full font-bold shadow-xl transition transform hover:scale-105 inline-flex items-center justify-center !important no-underline" style="color: white !important;">
                        <i class="fas fa-location-arrow mr-3"></i> Get Directions
                    </a>
                </div>
            </div>
        </section>

    </div>`;
}

// Main execution
async function main() {
  console.log('🚀 Starting Beibei Amigos Community Pages Build\n');
  
  const results = [];
  
  for (let i = 0; i < PAGES.length; i++) {
    const page = PAGES[i];
    console.log(`\n[${ i + 1}/${PAGES.length}] Processing: ${page.name} (${page.slug})`);
    
    try {
      // Generate HTML content
      const htmlContent = generatePageContent(page, i);
      
      // Save HTML file locally
      const htmlPath = path.join(__dirname, `${page.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}.html`);
      const fullHtml = `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>${page.name} (${page.zip}) | Beibei Amigos Montessori Preschool</title>
    <meta name="description" content="Premier trilingual Montessori preschool for ${page.name} families (${page.zip}). Mandarin & Spanish immersion preparing for Kindergarten. Tour today!">
    <link rel="canonical" href="https://www.beibeiamigos.com/communities/${page.slug}/">
</head>
<body>
${htmlContent}
</body>
</html>`;
      
      fs.writeFileSync(htmlPath, fullHtml);
      console.log(`  ✓ Saved HTML: ${htmlPath}`);
      
      // Publish to WordPress
      console.log(`  → Publishing to WordPress...`);
      const wpResult = await publishPage(page, htmlContent);
      
      if (wpResult.status >= 200 && wpResult.status < 300) {
        const pageId = wpResult.data.id;
        const pageUrl = wpResult.data.link;
        console.log(`  ✓ Published: ${pageUrl} (ID: ${pageId})`);
        
        // Add to menu
        console.log(`  → Adding to navigation menu...`);
        const menuResult = await addToMenu(page, pageId);
        
        if (menuResult.status >= 200 && menuResult.status < 300) {
          console.log(`  ✓ Added to menu`);
        } else {
          console.log(`  ⚠ Menu add failed (may already exist): ${menuResult.status}`);
        }
        
        results.push({
          name: page.name,
          slug: page.slug,
          status: 'success',
          id: pageId,
          url: pageUrl
        });
      } else {
        console.error(`  ✗ WordPress publish failed: ${wpResult.status}`, wpResult.data);
        results.push({
          name: page.name,
          slug: page.slug,
          status: 'failed',
          error: wpResult.data
        });
      }
      
      // Brief delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      results.push({
        name: page.name,
        slug: page.slug,
        status: 'error',
        error: error.message
      });
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY\n');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');
  
  console.log(`✓ Successful: ${successful.length}/${PAGES.length}`);
  console.log(`✗ Failed: ${failed.length}/${PAGES.length}\n`);
  
  if (successful.length > 0) {
    console.log('Successfully Published Pages:');
    successful.forEach(r => {
      console.log(`  • ${r.name}: ${r.url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nFailed Pages:');
    failed.forEach(r => {
      console.log(`  • ${r.name}: ${r.error || 'Unknown error'}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ Build complete!\n');
}

main().catch(console.error);
