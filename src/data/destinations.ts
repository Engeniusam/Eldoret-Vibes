export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  region: 'kapsabet' | 'eldoret';
  county: string;
  distance: string;
  distanceKm: number;
  locationDetails: string;
  category: 'waterfalls' | 'chill' | 'sports' | 'nature' | 'budget';
  tags: string[];
  trending?: boolean;
  rating: number;
  reviewsCount: number;
  studentPrice: string;
  regularPrice: string;
  priceValue: number; // For filtering (KES)
  highlights: string[];
  transportMode: string;
  transportDetails: {
    matatuLine: string;
    stageLocation: string;
    matatuFareKES: number;
    bodaBodaFareKES: number;
    instructions: string;
  };
  operatingHours: string;
  coordinates: {
    lat: number;
    lng: number;
    formatted: string;
  };
  studentPerks: {
    title: string;
    description: string;
    verified: boolean;
  };
  bestTime: string;
  imageUrl: string;
  imageAlt: string;
  description: string;
  tips: string[];
}

export const DESTINATIONS: Destination[] = [
  // --- KAPSABET DESTINATIONS ---
  {
    id: 'kingwal-swamp',
    name: 'Kingwal Swamp Sitatunga Sanctuary',
    subtitle: 'Rare semi-aquatic antelope wetland & eco-boardwalk',
    region: 'kapsabet',
    county: 'Nandi County (Kapsabet)',
    distance: '14.0 km from Kapsabet Town / 28.5 km from Eldoret',
    distanceKm: 14.0,
    locationDetails: 'Off Eldoret–Kapsabet Highway near Chemundu Stage',
    category: 'nature',
    tags: ['Kapsabet Special', 'Wildlife & Wetlands', 'Student Budget', 'Rare Antelopes'],
    trending: true,
    rating: 4.9,
    reviewsCount: 412,
    studentPrice: 'KES 150 Student ID',
    regularPrice: 'KES 300 Reg',
    priceValue: 150,
    highlights: ['Sitatunga Antelopes', 'Crested Cranes', 'Eco-Boardwalk', 'Community Guides', 'Nature Photography'],
    transportMode: 'Matatu Line 4 to Chemundu then 5-min Boda',
    transportDetails: {
      matatuLine: 'Kapsabet Express / Line 4 (from Eldoret Central or Kapsabet Stage)',
      stageLocation: 'Board at Eldoret Kapsabet Stage (opposite Sosiani) or Kapsabet CBD Bus Park',
      matatuFareKES: 120,
      bodaBodaFareKES: 50,
      instructions: 'Alight at Chemundu shopping center junction, then take a short 5-minute Boda to the Kingwal community conservation gate.'
    },
    operatingHours: '06:30 AM – 06:00 PM (Best at sunrise/dusk for antelope sightings)',
    coordinates: {
      lat: 0.2847,
      lng: 35.1328,
      formatted: '0.2847° N, 35.1328° E • Kingwal Basin'
    },
    studentPerks: {
      title: 'University Ecology & Wildlife Discount',
      description: 'Show your Moi University, UoE, or University of Kabianga student ID for 50% discount on entry plus complimentary binoculars rental from local conservation scouts.',
      verified: true
    },
    bestTime: '07:00 AM – 09:30 AM or 4:30 PM – 6:15 PM (Sitatungas emerge to feed)',
    imageUrl: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Scenic lush wetlands and green reeds at Kingwal Swamp near Kapsabet Kenya with clear reflective waters and highland mist',
    description: 'Kingwal Swamp in Nandi County is one of the world\'s few remaining natural sanctuaries for the rare, semi-aquatic Sitatunga antelope. Featuring wooden marsh walkways, endemic water birds, and panoramic tea ridges, it offers an extraordinary weekend retreat for student nature groups.',
    tips: [
      'Carry gumboots or waterproof footwear for rainy morning treks',
      'Binoculars are available for rent at KES 50 at the scout cabin',
      'Silence is requested on the boardwalks to avoid startling antelopes'
    ]
  },
  {
    id: 'chepkiit-falls',
    name: 'Chepkiit Waterfalls & Kipkaren Gorge',
    subtitle: 'Thunderous basalt rapids & hanging footbridge',
    region: 'kapsabet',
    county: 'Nandi / Uasin Gishu Border',
    distance: '18.2 km from Kapsabet / 22.0 km from Eldoret CBD',
    distanceKm: 18.2,
    locationDetails: 'Off Eldoret–Kapsabet Highway (Mlango Junction)',
    category: 'waterfalls',
    tags: ['Waterfalls & Hiking', 'Kapsabet Corridor', 'Cliff Suspension', 'Picnic Sites'],
    trending: true,
    rating: 4.8,
    reviewsCount: 580,
    studentPrice: 'KES 100 Student ID',
    regularPrice: 'KES 250 Reg',
    priceValue: 100,
    highlights: ['Thunderous Cataracts', 'Suspension Bridge', 'Cave Formations', 'Picnic Rock Outcrops', 'Cool Pine Groves'],
    transportMode: 'Matatu to Mlango Junction + KES 50 Boda',
    transportDetails: {
      matatuLine: 'Eldoret–Kapsabet Shuttle / Kipkaren Matatus',
      stageLocation: 'Eldoret Central Kapsabet Stage or Kapsabet Town Terminal',
      matatuFareKES: 100,
      bodaBodaFareKES: 50,
      instructions: 'Alight at Mlango Junction on the Eldoret–Kapsabet road. Direct boda bodas to Chepkiit waterfall gate charge KES 50.'
    },
    operatingHours: '07:00 AM – 06:30 PM daily',
    coordinates: {
      lat: 0.4289,
      lng: 35.1842,
      formatted: '0.4289° N, 35.1842° E • Kipkaren River'
    },
    studentPerks: {
      title: 'Free Group Picnic Gazebo',
      description: 'Campus study circles or student groups with 4+ IDs receive complimentary access to the designated sheltered barbecue & picnic glade.',
      verified: true
    },
    bestTime: 'Mid-morning (10:00 AM) to late afternoon',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Powerful natural waterfall cascading over basalt cliffs with lush green river banks and misty spray at Chepkiit Falls near Kapsabet',
    description: 'Chepkiit Waterfall is a dramatic natural wonder carved by the Kipkaren River through volcanic rock. Featuring sweeping viewpoints, natural cave crevices, and wooden suspension bridges, this is the prime hiking spot linking Eldoret and Kapsabet.',
    tips: [
      'Stay behind designated safety barriers on slippery spray rocks',
      'The lower gorge route is ideal for rock scrambling with sturdy trail shoes',
      'Pack your own snacks or lunch as cafe facilities nearby are modest'
    ]
  },
  {
    id: 'kapsabet-athletics',
    name: 'Kapsabet Athletic Ground & Kipchoge Track',
    subtitle: 'The legendary cradle of Olympic marathon champions',
    region: 'kapsabet',
    county: 'Nandi County (Kapsabet)',
    distance: '0.8 km from Kapsabet CBD / 39.5 km from Eldoret',
    distanceKm: 0.8,
    locationDetails: 'Kapsabet Town Center, next to Eliud Kipchoge Training Complex',
    category: 'sports',
    tags: ['Sports & Parks', 'Home of Champions', 'High-Altitude Training', 'Student Budget'],
    trending: false,
    rating: 4.7,
    reviewsCount: 329,
    studentPrice: 'Free Entry with Student ID',
    regularPrice: 'KES 100 Public',
    priceValue: 0,
    highlights: ['400m Red Clay Track', 'Historic Training Ground', 'Fitness Pavilions', 'Highland Breeze', 'Athletic Cafe'],
    transportMode: 'Walking distance from Kapsabet Bus Park',
    transportDetails: {
      matatuLine: 'Line 1 Kapsabet Town Circuit',
      stageLocation: 'Central Kapsabet roundabout or walking from Kapsabet Boys High School gate',
      matatuFareKES: 30,
      bodaBodaFareKES: 40,
      instructions: 'Located just 5 minutes walk from Kapsabet Post Office and the Eliud Kipchoge Library complex.'
    },
    operatingHours: '05:30 AM – 07:00 PM (Athletes sprint early morning 6:00 AM)',
    coordinates: {
      lat: 0.2014,
      lng: 35.1052,
      formatted: '0.2014° N, 35.1052° E • 2,050m Altitude'
    },
    studentPerks: {
      title: 'Free Track & Gym Pass',
      description: 'University & college student athletes gain free access to the high-altitude stamina training track and open workout circuit.',
      verified: true
    },
    bestTime: '06:00 AM – 08:30 AM (Catch world champions during morning speed work)',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Clean athletic running track and emerald green highland grass surrounded by pine trees in Kapsabet Kenya',
    description: 'Known worldwide as the heartland of Kenyan middle and long-distance dominance, Kapsabet Athletic Ground is where Olympic champions hone their craft at 2,050m altitude. A must-visit pilgrimage for sports enthusiasts and student fitness fans.',
    tips: [
      'Arrive before 7 AM if you wish to see elite pacing groups in action',
      'The perimeter trail is open for casual morning jogs and interval sprints'
    ]
  },
  {
    id: 'chemomi-tea',
    name: 'Chemomi Tea Estate & Nandi Overlook',
    subtitle: 'Endless rolling emerald tea ridges & cloud forest views',
    region: 'kapsabet',
    county: 'Nandi County (Kapsabet)',
    distance: '8.5 km from Kapsabet Town / 34.0 km from Eldoret',
    distanceKm: 8.5,
    locationDetails: 'Chemomi Factory Road, Nandi Escarpment ridge',
    category: 'chill',
    tags: ['Kapsabet Special', 'Chilling Spots', 'Tea Tourism', 'Sunset Pick', 'Scenic Ridge'],
    trending: true,
    rating: 4.9,
    reviewsCount: 468,
    studentPrice: 'KES 150 Student ID',
    regularPrice: 'KES 300 Reg',
    priceValue: 150,
    highlights: ['Tea Tasting Gazebo', 'Contour Farm Photography', 'Great Rift Valley Vistas', 'Cool Mountain Mist', 'Tea Plucking Tour'],
    transportMode: 'Matatu to Chemomi Market + KES 50 Boda',
    transportDetails: {
      matatuLine: 'Kapsabet–Nandi Hills Town Service',
      stageLocation: 'Kapsabet East Terminal',
      matatuFareKES: 70,
      bodaBodaFareKES: 50,
      instructions: 'Take the scenic tea route matatu from Kapsabet towards Chemomi; stop at the estate viewpoint viewpoint overlook.'
    },
    operatingHours: '08:00 AM – 06:00 PM',
    coordinates: {
      lat: 0.1421,
      lng: 35.1587,
      formatted: '0.1421° N, 35.1587° E • Chemomi Ridge'
    },
    studentPerks: {
      title: 'Free Fresh Highland Tea Tasting',
      description: 'Show university ID for a complimentary cup of authentic loose-leaf purple and black highland tea at the estate observation terrace.',
      verified: true
    },
    bestTime: '03:30 PM – 06:15 PM (Golden hour over the tea valleys)',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Vibrant emerald green rolling tea plantation terraced across highland hills in Nandi County near Kapsabet Kenya',
    description: 'Chemomi Tea Estate presents one of East Africa\'s most breathtaking agricultural landscapes. Sweeping green tea plantations curve along the crest of the Nandi Escarpment, offering crisp alpine air, estate tours, and sunset viewpoints.',
    tips: [
      'Bring a light sweater or fleece as temperatures dip in late afternoon',
      'Ask the guides for a tea plucking basket for iconic photos'
    ]
  },
  {
    id: 'nandi-rock',
    name: 'Nandi Rock (Sheu Morobi Cliff)',
    subtitle: 'Towering cliff summit with 180° Rift Valley panorama',
    region: 'kapsabet',
    county: 'Nandi County',
    distance: '26.0 km from Kapsabet / 44.0 km from Eldoret',
    distanceKm: 26.0,
    locationDetails: 'Southern Nandi Escarpment, overlooking Kano Plains',
    category: 'waterfalls',
    tags: ['Waterfalls & Hiking', 'Historic Landmark', 'Rock Climbing', 'Day Trip'],
    trending: false,
    rating: 4.8,
    reviewsCount: 395,
    studentPrice: 'KES 200 Student ID',
    regularPrice: 'KES 400 Reg',
    priceValue: 200,
    highlights: ['Sheu Morobi Cliff Edge', 'Rift Valley Drop-Off', 'Rock Climbing Routes', 'Campfire Glade', 'Rich Heritage'],
    transportMode: 'Group Van or Matatu via Kapsabet–Chepterit',
    transportDetails: {
      matatuLine: 'Chepterit / Lessos Matatu from Kapsabet',
      stageLocation: 'Kapsabet South Bus Station',
      matatuFareKES: 130,
      bodaBodaFareKES: 100,
      instructions: 'Board Matatu to Chepterit town, then hire a local Boda boda guide to the Nandi Rock conservation trail head.'
    },
    operatingHours: '07:00 AM – 05:30 PM (Hiking guides mandatory for edge trail)',
    coordinates: {
      lat: 0.0892,
      lng: 35.1219,
      formatted: '0.0892° N, 35.1219° E • Sheu Morobi'
    },
    studentPerks: {
      title: 'Guide Fee Discount for Student Crews',
      description: 'Accredited community guides charge a flat KES 400 total for student groups of up to 8 people (regular KES 1,000).',
      verified: true
    },
    bestTime: '08:00 AM – 01:00 PM for clear sky views of Lake Victoria in the distance',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dramatic mountainous rock bluff and rugged cliff escarpment overlooking lush green Rift Valley below',
    description: 'Nandi Rock (historically Sheu Morobi) is the most imposing natural monument along the Nandi Escarpment. Rising over 1,000 meters above the valley floor below, on clear days visitors can see all the way to Lake Victoria and the Kakamega forest canopy.',
    tips: [
      'A local community guide is required for navigation along the cliff rim',
      'Carry 1.5L of water and sunscreen for the 3-hour round hike'
    ]
  },
  {
    id: 'kiborgok-falls',
    name: 'Kiborgok / Tindinyo Forest Falls',
    subtitle: 'Hidden indigenous rainforest plunge pool & canopy trail',
    region: 'kapsabet',
    county: 'Nandi County (Kapsabet)',
    distance: '15.5 km from Kapsabet Town / 38.0 km from Eldoret',
    distanceKm: 15.5,
    locationDetails: 'Tindinyo Forest Edge, off Kapsabet–Chavakali Road',
    category: 'waterfalls',
    tags: ['Waterfalls & Hiking', 'Hidden Gem', 'Student Budget', 'Swimming Pool'],
    trending: false,
    rating: 4.7,
    reviewsCount: 275,
    studentPrice: 'KES 100 Student ID',
    regularPrice: 'KES 200 Reg',
    priceValue: 100,
    highlights: ['Natural Plunge Pool', 'Rainforest Canopy', 'Monkey Sightings', 'Bamboo Grove Trails', 'Campfire Spots'],
    transportMode: 'Matatu towards Tindinyo / Chavakali + KES 40 Boda',
    transportDetails: {
      matatuLine: 'Kapsabet–Chavakali Highway Matatus',
      stageLocation: 'Kapsabet West Stage',
      matatuFareKES: 80,
      bodaBodaFareKES: 40,
      instructions: 'Alight at Tindinyo market center; the waterfall entrance path begins behind the old missionary water mill.'
    },
    operatingHours: '08:00 AM – 06:00 PM',
    coordinates: {
      lat: 0.1654,
      lng: 34.9812,
      formatted: '0.1654° N, 34.9812° E • Tindinyo Edge'
    },
    studentPerks: {
      title: 'Free Camping Pit Firewood',
      description: 'University weekend campers receive a complimentary bundle of dry campfire wood with 3+ student passes.',
      verified: true
    },
    bestTime: '11:00 AM – 04:00 PM for warm sunshine in the forest gorge',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Pristine forest waterfall cascading into a clear emerald plunge pool with dense green jungle foliage',
    description: 'Tucked away at the transitional zone between the Nandi Hills and the Kakamega forest ecosystem, Kiborgok Falls is an intimate wilderness hideaway featuring cooling cascades and a tranquil natural swimming pool.',
    tips: [
      'Bring swimwear and a quick-dry towel if you plan to swim in the pool',
      'The trail can be muddy after afternoon rains, bring good grip shoes'
    ]
  },

  // --- ELDORET & UASIN GISHU DESTINATIONS ---
  {
    id: 'koromosho-falls',
    name: 'Koromosho Falls & River Sosiani Gorge',
    subtitle: 'Volcanic basalt canyon with thunderous highland waterfall',
    region: 'eldoret',
    county: 'Uasin Gishu County',
    distance: '18.5 km from Eldoret CBD',
    distanceKm: 18.5,
    locationDetails: 'Chepkoilel / Sergoit Road, Sosiani River Gorge',
    category: 'waterfalls',
    tags: ['Waterfalls & Hiking', 'Trending', 'Student Budget', 'Scenic Gorge'],
    trending: true,
    rating: 4.8,
    reviewsCount: 342,
    studentPrice: 'KES 200 Student ID',
    regularPrice: 'KES 350 Reg',
    priceValue: 200,
    highlights: ['Scenic Basalt Gorge', 'Rock Scrambling', 'Photography Vistas', 'Matatu Stage Nearby', 'River Rapids'],
    transportMode: 'Matatu Line 9 (Sergoit) + KES 50 Boda',
    transportDetails: {
      matatuLine: 'Matatu Line 9 (Sergoit / Chepkoilel stage)',
      stageLocation: 'Eldoret Central Stage (behind Paul\'s Bakery)',
      matatuFareKES: 70,
      bodaBodaFareKES: 50,
      instructions: 'Take Line 9 to the main Sergoit junction (KES 70), then hop onto a 5-minute local Boda boda (KES 50) directly to the gorge path.'
    },
    operatingHours: '07:30 AM – 06:30 PM',
    coordinates: {
      lat: 0.5849,
      lng: 35.1983,
      formatted: '0.5849° N, 35.1983° E • River Sosiani'
    },
    studentPerks: {
      title: 'Moi Uni & UoE Special Access',
      description: 'Show your student badge on Fridays for a free guided gorge walk, campfire pit reservation, and access to group picnic shelter.',
      verified: true
    },
    bestTime: 'Morning 8:30 AM – 11:30 AM for golden light and waterfall mist rainbows',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx5Njz0stPY160xJe2t1HQWKZhF4OgDtljwBhRRj1DfHpuB56YiXcSuHzwiR155FVD_bk2wKNx6-Wn-HrOIXnLE6NSVkOHwq89usD265cX47ljROPUQxPZTpnRV7Uwpo0HcLZbZaiffJXK0R2jiOXMmD3dhjqrwOLDUCaq52_5-YTWKmKr8AUz4oa5ecX9yxIG2hgNr22AhDLrzCIg2OFxNAS0QelBK4iKDCwothY',
    imageAlt: 'Photorealistic wide angle of Koromosho Falls near Eldoret Kenya with thunderous natural waterfall cascading through basalt volcanic gorge into the river below lush highland green foliage mist and golden morning daylight',
    description: 'Koromosho Falls is Eldoret\'s most iconic natural cascade, where the Sosiani River drops over 25 meters down a sheer volcanic cliff into an ancient basalt canyon. Revered by students and hikers for its dramatic scenery and accessible trails.',
    tips: [
      'Sturdy shoes or trail runners are strictly recommended for the lower canyon path',
      'The morning hours feature spectacular rainbow halos across the river mist'
    ]
  },
  {
    id: 'eldoret-sports-club',
    name: 'Eldoret Sports Club & Clubhouse',
    subtitle: 'Historic manicured athletics lawns, rugby grounds & pool',
    region: 'eldoret',
    county: 'Uasin Gishu County',
    distance: '2.3 km from Eldoret CBD',
    distanceKm: 2.3,
    locationDetails: 'Off Kaptagat Road / Elgon View Drive',
    category: 'sports',
    tags: ['Sports & Parks', 'Athletics Hub', 'Town Center', 'Student Deals'],
    trending: false,
    rating: 4.7,
    reviewsCount: 518,
    studentPrice: 'KES 150 Entry / Free Uni Pass',
    regularPrice: 'KES 300 Reg',
    priceValue: 150,
    highlights: ['Chilled Lawns', 'Rugby Pitch', 'Swimming Pool', 'Cafe Terrace', 'High-Speed Wi-Fi'],
    transportMode: 'Short walk or KES 50 Boda from town',
    transportDetails: {
      matatuLine: 'Elgon View Boda Boda or Town Matatu Line 2',
      stageLocation: 'Barngetuny Plaza Stage',
      matatuFareKES: 40,
      bodaBodaFareKES: 50,
      instructions: 'Located just past the Moi Teaching and Referral Hospital turnoff along Kaptagat Road.'
    },
    operatingHours: '06:00 AM – 10:00 PM daily',
    coordinates: {
      lat: 0.5147,
      lng: 35.2891,
      formatted: '0.5147° N, 35.2891° E • Elgon View'
    },
    studentPerks: {
      title: 'Wednesday Student Swim & Study Special',
      description: 'Half-price pool passes for registered students, plus reserved quiet outdoor terrace tables with charging outlets.',
      verified: true
    },
    bestTime: 'Afternoon 2:00 PM – 6:00 PM for rugby matches and sunbathing on the terrace',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6nspoN84wOcMKz8uBP11GeKnB3slGlCMb3TVV81EnqkH2Nj0QVmh802MyLdSAyH2TxaID8ZtVxSkh-J6MFeeoWcvMk8incdIiyIxdHJG_2BbU_sWpl0VA4AtYqhHMB153tkAelNaQtUtPPgAg7A6GuhG_muQqXo08E9UX-P3WVqvSj_p0NC67u7YcE5p1lGrgSRk0xSEJlcp39k72jBzGRPYC_nFJg1EAb98ar7U',
    imageAlt: 'Lush manicured grass athletic fields and scenic pine trees at Eldoret Sports Club Kenya with university athletes training and clubhouse cafe terrace under vibrant blue highland sky',
    description: 'Eldoret Sports Club is the Premier weekend gathering hub for Eldoret\'s athletic and student community. With expansive green lawns, Olympic-standard rugby pitches, a heated pool, and relaxed outdoor terraces, it\'s the quintessential town chill ground.',
    tips: [
      'Check their weekend calendar for local Eldoret RFC rugby home fixtures',
      'Pool towels can be rented at reception for KES 50'
    ]
  },
  {
    id: 'two-rivers-dam',
    name: 'Two Rivers Dam (Sosiani Basin)',
    subtitle: 'Peaceful sunset reservoir, bird-watching & lakeside chill',
    region: 'eldoret',
    county: 'Uasin Gishu County',
    distance: '6.8 km from Eldoret CBD',
    distanceKm: 6.8,
    locationDetails: 'Off Kapsoya Bypass, Sosiani River Basin',
    category: 'chill',
    tags: ['Chilling Spots', 'Sunset Pick', 'Student Budget', 'Open Weekend'],
    trending: true,
    rating: 4.6,
    reviewsCount: 289,
    studentPrice: 'Free Access / Boat KES 200',
    regularPrice: 'Boat KES 350',
    priceValue: 0,
    highlights: ['Picnic Sites', 'Sunset Views', 'Bird Watching', 'Boda Accessible', 'Wooden Benches'],
    transportMode: 'Kapsoya Matatu to terminus + 10-min walk',
    transportDetails: {
      matatuLine: 'Kapsoya Line 5 Matatu',
      stageLocation: 'Eldoret Main Bus Park (Stage 5)',
      matatuFareKES: 50,
      bodaBodaFareKES: 50,
      instructions: 'Board Kapsoya line to the end of the tarmac; the dam reservoir path branches gently to the right.'
    },
    operatingHours: '06:00 AM – 07:00 PM (Best for sunsets: 4:30 PM – 6:30 PM)',
    coordinates: {
      lat: 0.5283,
      lng: 35.3129,
      formatted: '0.5283° N, 35.3129° E • Kapsoya Basin'
    },
    studentPerks: {
      title: 'Discounted Rowing Boat Ride',
      description: 'Present Moi Uni or Eldoret campus ID for KES 200 student rowing boat experience with safety life vests included.',
      verified: true
    },
    bestTime: '04:30 PM – 06:30 PM for sunset golden reflections on water',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIziqx9myfH7Or7gkXDyCsul6Lx_9AN44CmML-VyB-i97smLfHJNX83YBfH-jdJ4nP0xfFF6vWgcFDtkCIOuAG_q1pITaj_OG4N68wjehIeuSGzu9-4QylCKWEt9c6MrizFvI2cgArAocx6DnBPwNFDOjjCVftlgbsdP_cxHOTe-YLIB2qa1PuI81bnoUUOyF6-EHPnlJReqhTcXqoY53IFM1mPB--r9BJqVlTYhU',
    imageAlt: 'Peaceful sunset over Two Rivers Dam Sosiani River basin Eldoret Kenya with reflections on calm waters, green embankment with wooden picnic benches and bird watchers',
    description: 'An idyllic freshwater reservoir created along the Sosiani River basin, Two Rivers Dam offers tranquil waterfront embankments lined with acacia trees. A beloved spot for couples, student picnics, and relaxing photography away from the busy CBD.',
    tips: [
      'Pack your own picnic basket and blanket as vendors are stationed only at the gate',
      'Sunset reflections over the mirror-calm water make for stunning campus photos'
    ]
  },
  {
    id: 'nandi-hills-escarpment',
    name: 'Nandi Hills Escarpment Lookout',
    subtitle: 'Great Rift Valley cliff drop-off & tea cloud forests',
    region: 'eldoret',
    county: 'Uasin Gishu / Nandi Border',
    distance: '24.0 km from Eldoret CBD',
    distanceKm: 24.0,
    locationDetails: 'Kapsasur / Nandi Hills Overlook Highway',
    category: 'waterfalls',
    tags: ['Waterfalls & Hiking', 'Day Trip', 'Great Views', 'Student Budget'],
    trending: true,
    rating: 4.9,
    reviewsCount: 620,
    studentPrice: 'KES 250 Eco-Conservation Fee',
    regularPrice: 'KES 400 Reg',
    priceValue: 250,
    highlights: ['Tea Estate Trails', 'Cloud Forest Vistas', 'Campfire Glades', 'Group Vans', 'Wild Orchids'],
    transportMode: 'Nandi Hills Matatu from Eldoret Main Terminal',
    transportDetails: {
      matatuLine: 'Eldoret–Nandi Hills Shuttle',
      stageLocation: 'Eldoret KVDA Plaza Stage',
      matatuFareKES: 120,
      bodaBodaFareKES: 60,
      instructions: 'Take the shuttle to Kapsasur viewpoint or Nandi Hills town crest; the trail branches directly from the highway overlook.'
    },
    operatingHours: '06:00 AM – 06:30 PM',
    coordinates: {
      lat: 0.1034,
      lng: 35.1832,
      formatted: '0.1034° N, 35.1832° E • Nandi Rim'
    },
    studentPerks: {
      title: 'Group Vans Park Free',
      description: 'Student organized 14-seater matatus or campus buses receive free parking passes at the main escarpment viewpoint.',
      verified: true
    },
    bestTime: 'Early morning for sea of clouds phenomenon over the valley floor',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuJ4H4vgtdQpSEN2jqYZpBZbHmQP2gnupQfdyz-41hu7Za6lOuvtTa5WB0p_b9VvTiq9Wn-IyDDTFT_Bukhfw3k46yunpNDAvpjJ7aRN2jc_taFUA0rtm9YXt4MSBBjjci4rQkQy6E4iVJ9RqTCim8QC3_Ndyc3F0NmFHJbIIWpW6Hx2MaJdfcKiJuU5yp8iN9LdR1ci8bOY-MgtVvWoOBB_bfVY0gNNAf_waouCs',
    imageAlt: 'Breathtaking rolling emerald tea plantations and rugged cliff escarpment overlooking the expansive Great Rift Valley at Nandi Hills near Eldoret Kenya on an adventurous crisp morning',
    description: 'The dramatic crest of the Nandi Escarpment offers sweeping vistas over the Great Rift Valley, verdant tea estates, and indigenous highland forests. An essential day trip for student hiking groups and photography clubs.',
    tips: [
      'Early arrivals (before 8 AM) get treated to the famous "sea of clouds" phenomenon',
      'Local tea stalls near the viewpoint serve piping hot chai and fresh mandazis'
    ]
  },
  {
    id: 'naiberi-river',
    name: 'Naiberi River Campsite & Stone Cavern',
    subtitle: 'Unique stone cavern architecture & riverside forest trails',
    region: 'eldoret',
    county: 'Uasin Gishu County',
    distance: '16.2 km from Eldoret CBD',
    distanceKm: 16.2,
    locationDetails: 'Along Eldoret–Eldama Ravine Road',
    category: 'chill',
    tags: ['Chilling Spots', 'Stone Caverns', 'Riverside', 'Campfire'],
    trending: false,
    rating: 4.8,
    reviewsCount: 310,
    studentPrice: 'KES 200 Day Pass',
    regularPrice: 'KES 350 Reg',
    priceValue: 200,
    highlights: ['Handmade Stone Architecture', 'River Nature Trails', 'Stone Bar & Hearth', 'Swimming Glade', 'Bird Watching'],
    transportMode: 'Matatu towards Kaptagat / Ravine + KES 50 Boda',
    transportDetails: {
      matatuLine: 'Kaptagat / Eldama Ravine Matatus',
      stageLocation: 'Eldoret Kaptagat Stage',
      matatuFareKES: 90,
      bodaBodaFareKES: 50,
      instructions: 'Alight at Naiberi junction on Eldama Ravine Road; the entrance gates are 400m along the river track.'
    },
    operatingHours: '08:00 AM – 11:00 PM',
    coordinates: {
      lat: 0.4491,
      lng: 35.4012,
      formatted: '0.4491° N, 35.4012° E • Naiberi Stream'
    },
    studentPerks: {
      title: 'Discounted Group Camping Pitch',
      description: 'KES 500 per student tent per night with hot showers, campfire pit, and firewood included.',
      verified: true
    },
    bestTime: 'Afternoon to evening for cavern cozy fireside dining',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cozy rustic riverside lodge with natural stone boulders, campfire glow, and pine forest near Eldoret',
    description: 'Naiberi River Campsite is an artistic masterpiece built entirely from natural river stones and local timber. Located alongside a rushing highland river, it is famous for its cozy cavern lounge, riverside camping glades, and refreshing natural swimming holes.',
    tips: [
      'Warm jackets are essential for night camping by the river',
      'The cavern fireside lounge offers board games and student group seating'
    ]
  },
  {
    id: 'sergoit-hill',
    name: 'Sergoit Hill & Wildlife Conservancy',
    subtitle: 'Towering volcanic inselberg, giraffes & panoramic Moiben plains',
    region: 'eldoret',
    county: 'Uasin Gishu County',
    distance: '15.0 km from Eldoret CBD',
    distanceKm: 15.0,
    locationDetails: 'Off Eldoret–Iten Road, near Sergoit Center',
    category: 'nature',
    tags: ['Wildlife & Wetlands', 'Hiking Trails', 'Inselberg Summit', 'Rothschild Giraffes'],
    trending: false,
    rating: 4.7,
    reviewsCount: 264,
    studentPrice: 'KES 250 Student ID',
    regularPrice: 'KES 500 Reg',
    priceValue: 250,
    highlights: ['Endangered Rothschild Giraffes', 'Rocky Summit Climb', 'Panoramic Rift View', 'Nature Sanctuary', 'Zebra Herds'],
    transportMode: 'Iten Matatu to Sergoit Junction + Boda',
    transportDetails: {
      matatuLine: 'Eldoret–Iten Matatu Line 8',
      stageLocation: 'Eldoret Iten Stage (near Oginga Odinga St)',
      matatuFareKES: 80,
      bodaBodaFareKES: 60,
      instructions: 'Take the Iten matatu to Sergoit shopping center; take a short Boda ride to the conservancy gate.'
    },
    operatingHours: '07:00 AM – 06:00 PM',
    coordinates: {
      lat: 0.6512,
      lng: 35.3621,
      formatted: '0.6512° N, 35.3621° E • Sergoit Rock'
    },
    studentPerks: {
      title: 'Free Safari Ranger Escort',
      description: 'Student groups of 5+ get accompanied by an armed KWS community ranger for the giraffe walking trail at no extra cost.',
      verified: true
    },
    bestTime: '08:00 AM – 11:00 AM for active wildlife grazing on the plains',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Tall rocky hill inselberg rising above African acacia savanna with giraffes and wildlife grazing in golden light',
    description: 'Sergoit Hill is a striking geological inselberg that dominates the Uasin Gishu plateau. Surrounded by a protected wildlife conservancy harboring endangered Rothschild giraffes, zebras, and antelopes, it is an exhilarating hike to the summit rocky outcrops.',
    tips: [
      'The final 20-minute scramble to the inselberg peak requires steady footing',
      'Binoculars and cameras with telephoto lenses will capture fantastic wildlife shots'
    ]
  }
];
