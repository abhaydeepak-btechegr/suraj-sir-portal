import { VideoBatch, Book, MockTest, Notice, Doubt, PortalBatch } from '../types';

export const initialNotices: Notice[] = [
  {
    id: 'n1',
    title: 'Admissions Open for JEE/NEET 2027 Intensive Batches',
    content: 'Registration is now open for the offline and online intensive course commencing from August 1st. Direct guidance under Suraj Sir with dedicated doubt sessions.',
    date: '2026-07-12',
    category: 'Urgent'
  },
  {
    id: 'n2',
    title: 'All India Mega Physics Mock Test Schedule',
    content: 'The syllabus for the upcoming Mega Mock Test on July 20th will cover Kinematics, Laws of Motion, and Electrostatics. Standard exam patterns apply.',
    date: '2026-07-10',
    category: 'Exam'
  },
  {
    id: 'n3',
    title: 'Free Class 12 Calculus Masterclass on YouTube',
    content: 'Tune in this Saturday at 6:00 PM for a 3-hour marathon session on Integral Calculus. Shortcut tricks and past 10 years JEE questions will be solved live.',
    date: '2026-07-08',
    category: 'Batch'
  },
  {
    id: 'n4',
    title: 'New Study Materials & Formula Booklets Uploaded',
    content: 'Chapter-wise summary formula notes for Mathematics (Vectors & 3D Geometry) and Chemistry (Chemical Bonding) are now downloadable in the Books section.',
    date: '2026-07-05',
    category: 'General'
  }
];

export const initialVideoBatches: VideoBatch[] = [
  {
    id: 'v1',
    title: 'Rotational Mechanics Mastery (JEE/NEET Level)',
    subject: 'Physics',
    description: 'Master the toughest topic in Classical Mechanics. We cover Moment of Inertia, Torque, Angular Momentum conservation, and pure rolling motion with intuitive visualizations.',
    duration: '18 Hours',
    lecturesCount: 12,
    teacher: 'Suraj Sir',
    youtubeId: 'b-HQ7g_SbyY', // Simulated video placeholder
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    enrolledStudents: 1420,
    rating: 4.9,
    tags: ['Class 11', 'Mechanics', 'JEE Advanced', 'NEET'],
    syllabus: [
      'Introduction to Rigid Body & Centre of Mass',
      'Moment of Inertia - Discrete & Continuous Systems',
      'Theorems of Parallel and Perpendicular Axes',
      'Torque and Angular Acceleration',
      'Equilibrium of Rigid Bodies & Toppling',
      'Angular Momentum & Its Conservation',
      'Combined Translational & Rotational Motion (Rolling)',
      'Work, Energy & Power in Rotational Motion'
    ]
  },
  {
    id: 'v2',
    title: 'Definite & Indefinite Integration masterclass',
    subject: 'Mathematics',
    description: 'Demystify calculus! Start from absolute basics and scale up to high-level integration tricks, properties of definite integrals, and area under the curve.',
    duration: '22 Hours',
    lecturesCount: 15,
    teacher: 'Suraj Sir',
    youtubeId: 'm4X2-iI70U4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    enrolledStudents: 1850,
    rating: 4.8,
    tags: ['Class 12', 'Calculus', 'JEE Main', 'Boards'],
    syllabus: [
      'Anti-derivatives & Fundamental Integration',
      'Integration by Substitution & Parts',
      'Trigonometric Integrals & Special Forms',
      'Partial Fractions & Algebraic Reduction',
      'Definite Integrals as Limit of a Sum',
      'Properties of Definite Integrals (King, Queen, Jack Rules)',
      'Leibniz Rule and Special Integrals',
      'Area Under the Curves & Differential Equations Intro'
    ]
  },
  {
    id: 'v3',
    title: 'Electrostatics & Gauss Law Essentials',
    subject: 'Physics',
    description: 'Learn the principles of Electric Charges, Coulomb Force, Electric Field Intensity, Electric Potential, and the power of Gauss Law to solve complex geometries.',
    duration: '15 Hours',
    lecturesCount: 10,
    teacher: 'Suraj Sir',
    youtubeId: '63yvT6fM2C8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800&q=80',
    enrolledStudents: 980,
    rating: 4.7,
    tags: ['Class 12', 'Electromagnetism', 'Boards', 'JEE/NEET'],
    syllabus: [
      'Electric Charge, Quantization & Coulomb\'s Law',
      'Electric Field Due to Point Charges & Continuous Dipole',
      'Electric Field Lines & Electric Flux',
      'Gauss Law Statement & Shell Theorems',
      'Applications of Gauss Law (Line, Cylinder, Sheet)',
      'Electric Potential & Potential Energy',
      'Equipotential Surfaces & Relation with Field',
      'Electrostatics of Conductors & Shielding'
    ]
  },
  {
    id: 'v4',
    title: 'Quadratic Equations & Complex Numbers',
    subject: 'Mathematics',
    description: 'A complete foundational batch covering quadratic root location, nature of roots, algebraic identities, Euler\'s identity, De Moivre\'s theorem, and geometry of complex numbers.',
    duration: '16 Hours',
    lecturesCount: 11,
    teacher: 'Suraj Sir',
    youtubeId: 'R97v_n2A1sU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=800&q=80',
    enrolledStudents: 1120,
    rating: 4.9,
    tags: ['Class 11', 'Algebra', 'JEE Mains', 'Olympiad'],
    syllabus: [
      'Nature of Roots & Coefficient Relations',
      'Common Roots & Symmetric Expressions',
      'Location of Roots (Most Important JEE Topic)',
      'Maximum and Minimum of Quadratic Expressions',
      'Introduction to Complex Numbers & iota',
      'Polar, Trigonometric, and Exponential Forms',
      'De Moivre\'s Theorem & Roots of Unity',
      'Geometry of Complex Numbers (Circles, Lines, Conics)'
    ]
  }
];

export const initialBooks: Book[] = [
  {
    id: 'b1',
    title: 'Suraj Sir\'s Physics Companion - Vol 1: Mechanics',
    subject: 'Physics',
    author: 'Suraj Sir (M.Tech, IIT Roorkee)',
    description: 'The ultimate guide for IIT-JEE & NEET Physics preparations. Features micro-theories, solved examples with double checks, and chapter-wise brain-teasing level-3 exercises.',
    pages: 340,
    classCategory: 'Class 11',
    coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    downloadCount: 3450,
    content: [
      'Welcome to Chapter 1: Kinematics in 1D and 2D. In this book, we simplify concepts of motion using vector calculus. Remeber that velocity is the instantaneous rate of change of position, v = ds/dt. Acceleration is a = dv/dt = v dv/ds. Standard kinematic equations are valid ONLY for constant acceleration systems.',
      'Chapter 2: Laws of Motion. Newton\'s First Law defines Inertia. The Second Law gives F = dp/dt (rate of change of momentum). The Third Law states action and reaction are equal and opposite. When drawing Free Body Diagrams (FBDs), isolate the system and include all real contact forces, normal forces, tension, friction, and remote gravity force.',
      'Chapter 3: Work, Energy, and Power. Work done is the line integral of force dot displacement. The Work-Energy Theorem states that work done by all forces (conservative + non-conservative + pseudo) is equal to the change in Kinetic Energy. Mechanical Energy is conserved only when non-conservative forces like friction do zero net work.',
      'Chapter 4: Conservation of Linear Momentum & Collisions. In the absence of external net force, the center of mass moves with constant velocity, and the total momentum of the system remains conserved. Coefficients of restitution (e) relate the relative separation speed to the relative approach speed.',
      'Congratulations on reading the preview! Keep practicing and solving numerical mock sheets regularly. High scores are built on foundations of deep concept clearance. - Suraj Sir'
    ]
  },
  {
    id: 'b2',
    title: 'High-Score Calculus Workbook',
    subject: 'Mathematics',
    author: 'Suraj Sir',
    description: 'More than 800+ practice questions categorized in basic, standard, and advanced levels for Board Exams and JEE Aspirants. Includes complete hints and solutions.',
    pages: 280,
    classCategory: 'Class 12',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    downloadCount: 4210,
    content: [
      'Calculus Chapter 1: Limits, Continuity & Differentiability. A function is continuous if Left Hand Limit = Right Hand Limit = Value of the Function. Differentiability requires that the tangent at that point is unique and non-vertical. L\'Hopital\'s Rule can be applied to evaluate 0/0 and inf/inf forms by differentiating numerator and denominator individually.',
      'Calculus Chapter 2: Methods of Differentiation. Master the chain rule! Keep track of composite functions: d/dx[f(g(x))] = f\'(g(x)) * g\'(x). Use logarithmic differentiation when bases and exponents both vary (e.g. y = x^x). Parametric differentiation is given by dy/dx = (dy/dt) / (dx/dt).',
      'Calculus Chapter 3: Applications of Derivatives. Learn tangent and normal equations. Mean Value Theorems (Rolle\'s and Lagrange\'s) ensure existence of points where instantaneous rate matches average rate. Maxima and Minima occur where f\'(x) = 0 (critical points); verify using the second derivative test f\'\'(x) < 0 for local maximum.',
      'Calculus Chapter 4: Standard Indefinite Integrals. Always remember the fundamental integrals like integral of sec(x) is ln|sec(x) + tan(x)| + C. For trigonometric ratios, use the substitution t = tan(x/2) to convert them into rational algebraic forms, also known as the Weierstrass Substitution.',
      'Keep your concepts sharp! Solve 10 calculus problems every single day to retain speed. - Suraj Sir'
    ]
  },
  {
    id: 'b3',
    title: 'Suraj Sir\'s Concept Builder Formula Sheets',
    subject: 'Mathematics',
    author: 'Suraj Sir',
    description: 'An ultimate pocket revision booklet containing all vital formulas, theorems, standard graphs, and hot shortcuts for instant revision before exams.',
    pages: 45,
    classCategory: 'Competitive',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    downloadCount: 6510,
    content: [
      'Quick Formula Guide 1: Coordinate Geometry. Distance d = sqrt((x2-x1)^2 + (y2-y1)^2). Section formula: (mx2+nx1)/(m+n). Slope of straight line y = mx+c. Angle between two lines tan(theta) = |(m1-m2)/(1+m1*m2)|. Distance of point from line: |ax1+by1+c| / sqrt(a^2+b^2).',
      'Quick Formula Guide 2: Trigonometric Relations. sin(A+B) = sinA cosB + cosA sinB. cos(A+B) = cosA cosB - sinA sinB. tan(A+B) = (tanA + tanB)/(1 - tanA tanB). sin(2A) = 2sinA cosA. cos(2A) = cos^2(A) - sin^2(A) = 2cos^2(A) - 1 = 1 - 2sin^2(A).',
      'Quick Formula Guide 3: Conic Sections. Circle: x^2 + y^2 = r^2. Tangent: xx1 + yy1 = r^2. Parabola: y^2 = 4ax with focus (a,0) and directrix x = -a. Ellipse: x^2/a^2 + y^2/b^2 = 1. Eccentricity e = sqrt(1 - b^2/a^2). Hyperbola: x^2/a^2 - y^2/b^2 = 1 with e = sqrt(1 + b^2/a^2).',
      'Formula revisions are your best friends in the last 7 days of JEE/NEET. Memorize them with their boundary conditions. All the best! - Suraj Sir'
    ]
  }
];

export const initialMockTests: MockTest[] = [
  {
    id: 'm1',
    title: 'JEE Main Physics Diagnostic Test',
    subject: 'Physics',
    durationMinutes: 10,
    totalMarks: 20,
    attemptsCount: 840,
    highScore: 20,
    questions: [
      {
        id: 'q1_1',
        text: 'A ball is projected horizontally from the top of a tower of height 19.6m with a velocity of 10 m/s. What is the time taken by the ball to strike the ground? (Take g = 9.8 m/s²)',
        options: [
          '1.0 second',
          '2.0 seconds',
          '3.0 seconds',
          '4.0 seconds'
        ],
        correctOption: 1,
        explanation: 'Using the vertical kinematics: h = 0.5 * g * t². Here, 19.6 = 0.5 * 9.8 * t² => 19.6 = 4.9 * t² => t² = 4 => t = 2 seconds. The horizontal velocity is irrelevant to the vertical time of flight.',
        subject: 'Physics'
      },
      {
        id: 'q1_2',
        text: 'The moment of inertia of a uniform thin circular ring of mass M and radius R about its tangent in its own plane is:',
        options: [
          '0.5 M R²',
          'M R²',
          '1.5 M R²',
          '2.0 M R²'
        ],
        correctOption: 2,
        explanation: 'According to the perpendicular axis theorem, the MI of a ring about its diameter is I_dia = 0.5 * M * R². Now, applying the parallel axis theorem for a tangent in the plane of the ring: I_tangent = I_dia + M * R² = 0.5 * M * R² + M * R² = 1.5 * M * R².',
        subject: 'Physics'
      },
      {
        id: 'q1_3',
        text: 'Two charges of +q and -q are separated by a small distance 2l. The electric potential at a point on the equatorial plane of this dipole at a distance r is:',
        options: [
          'k q / r',
          'Zero',
          'k q / r²',
          '2 k q / r'
        ],
        correctOption: 1,
        explanation: 'On the equatorial plane, any point is equidistant from both the charges +q and -q. The potentials due to individual charges are equal in magnitude and opposite in sign. Thus, V_total = V_+ + V_- = k q / d - k q / d = 0.',
        subject: 'Physics'
      },
      {
        id: 'q1_4',
        text: 'An engine lifts a load of 1000 kg to a vertical height of 10m in 10 seconds. What is the average power developed by the engine? (Take g = 10 m/s²)',
        options: [
          '100 Watts',
          '1,000 Watts',
          '10,000 Watts',
          '100,000 Watts'
        ],
        correctOption: 2,
        explanation: 'Work done W = m * g * h = 1000 * 10 * 10 = 100,000 Joules. Power = Work / Time = 100,000 J / 10 s = 10,000 Watts (10 kW).',
        subject: 'Physics'
      },
      {
        id: 'q1_5',
        text: 'A wire of resistance R is stretched uniformly to double its original length. What will be its new resistance?',
        options: [
          'R / 2',
          '2 R',
          '4 R',
          '16 R'
        ],
        correctOption: 2,
        explanation: 'When stretched, volume remains constant (V = A * L = constant). If L becomes 2L, area A must become A/2. Resistance R = rho * L / A. Therefore, R_new = rho * (2L) / (A/2) = 4 * (rho * L / A) = 4R.',
        subject: 'Physics'
      }
    ]
  },
  {
    id: 'm2',
    title: 'JEE Main Mathematics Speed Booster',
    subject: 'Mathematics',
    durationMinutes: 10,
    totalMarks: 20,
    attemptsCount: 1120,
    highScore: 20,
    questions: [
      {
        id: 'q2_1',
        text: 'What is the sum of all roots of the quadratic equation: x² - 5x + 6 = 0?',
        options: [
          '5',
          '6',
          '-5',
          '2'
        ],
        correctOption: 0,
        explanation: 'By Vieta\'s formulas, for any quadratic equation ax² + bx + c = 0, the sum of roots is given by -b/a. In this equation, a = 1, b = -5, so the sum is -(-5)/1 = 5. (The roots are 2 and 3, whose sum is indeed 5).',
        subject: 'Mathematics'
      },
      {
        id: 'q2_2',
        text: 'Evaluate the limit as x approaches 0 of (sin 3x) / x:',
        options: [
          '0',
          '1',
          '3',
          'Does not exist'
        ],
        correctOption: 2,
        explanation: 'Multiplying and dividing by 3: lim (x->0) [3 * (sin 3x) / 3x]. Since lim (u->0) (sin u / u) = 1, the limit evaluates to 3 * 1 = 3.',
        subject: 'Mathematics'
      },
      {
        id: 'q2_3',
        text: 'If z = 1 + i, what is the amplitude/argument of z in degrees?',
        options: [
          '30°',
          '45°',
          '60°',
          '90°'
        ],
        correctOption: 1,
        explanation: 'The real part x = 1 and imaginary part y = 1. The argument theta = arctan(y/x) = arctan(1/1) = 45° (or pi/4 radians). Since z is in the first quadrant, it is exactly 45°.',
        subject: 'Mathematics'
      },
      {
        id: 'q2_4',
        text: 'The value of the definite integral ∫ (from 0 to pi/2) of sin(x) / [sin(x) + cos(x)] dx is:',
        options: [
          'pi',
          'pi / 2',
          'pi / 4',
          '0'
        ],
        correctOption: 2,
        explanation: 'Applying the King\'s Property: ∫ f(x) dx = ∫ f(a+b-x) dx. The integral I = ∫ sin(x)/(sin x + cos x). Also, I = ∫ sin(pi/2-x)/[sin(pi/2-x) + cos(pi/2-x)] = ∫ cos(x)/[cos x + sin x]. Adding both: 2I = ∫ [sin x + cos x]/[sin x + cos x] dx = ∫ 1 dx from 0 to pi/2 = pi/2 => I = pi/4.',
        subject: 'Mathematics'
      },
      {
        id: 'q2_5',
        text: 'The number of subsets of a set containing 5 elements is:',
        options: [
          '5',
          '10',
          '25',
          '32'
        ],
        correctOption: 3,
        explanation: 'For any set of cardinality n, the power set has cardinality 2^n. Here n = 5, so total subsets = 2⁵ = 32.',
        subject: 'Mathematics'
      }
    ]
  }
];

export const initialDoubts: Doubt[] = [
  {
    id: 'd1',
    studentName: 'Amit Sharma',
    subject: 'Physics',
    title: 'Why is gravitational potential inside a solid sphere negative?',
    description: 'When we move from infinity to the inside of a solid mass, is work done by gravity or by us? Why does potential decrease further as we go to the center?',
    date: '2026-07-11',
    resolved: true,
    answers: [
      {
        author: 'Suraj Sir',
        text: 'Excellent question, Amit! Gravitational force is attractive. To bring a unit mass from infinity to any point, the gravitational field itself does positive work. Since potential is defined as negative of the work done by conservative fields, or the work done by an external agent to bring it slowly, we do negative work (the field pulls it, so we must pull backward to prevent acceleration). Hence the potential is negative. At the center, we are at the deepest possible point of the potential well, so the potential is at its absolute minimum value (-1.5 GM/R).',
        date: '2026-07-11',
        isTeacher: true
      }
    ]
  },
  {
    id: 'd2',
    studentName: 'Priya Patel',
    subject: 'Mathematics',
    title: 'Doubt in Leibniz Theorem rule for differentiating integrals',
    description: 'How do we differentiate an integral with variable limits when the integrand itself contains a variable term (like x)? Can we use the standard rule directly?',
    date: '2026-07-12',
    resolved: false,
    answers: []
  }
];

export const initialPortalBatches: PortalBatch[] = [
  {
    id: 'class_10',
    title: 'Class 10th Free Batch',
    tagline: 'CBSE Foundations & Board Preparation',
    description: 'A complete free syllabus course designed specifically for Class 10th students. Build a rock-solid foundation in Science and Mathematics, practice standard Board-level problem-solving, and master key derivations with Suraj Sir.',
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    enrolledText: '3.4k Students Enrolled',
    rating: '4.9 (120+ reviews)',
    subjects: {
      science: {
        id: 'science',
        name: 'Science',
        description: 'Complete high-yield Physics, Chemistry, and Biology topics with deep concept mapping.',
        icon: '🔬',
        color: 'from-emerald-500 to-teal-600',
        lectures: [
          {
            id: '10_sci_ref_1',
            lectureNumber: 'Lecture 01',
            title: 'Prakash ka Paravartan | Reflection of Light Class 10 Physics | Ray Diagram Easy Explanation | Hindi',
            duration: '60 mins',
            youtubeId: '_FSKjiotREo',
            thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
            description: 'Complete explanation of Reflection of Light, spherical mirrors, image formation, ray diagrams, and mirror formula in Hindi.'
          },
          {
            id: '10_sci_ref_2',
            lectureNumber: 'Lecture 02',
            title: 'Manav Netra ev Rang Viranga Sansar | Human Eye & Colourful World | Class 10 Science',
            duration: '55 mins',
            youtubeId: '4ds0eiFnYhE',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
            description: 'Master Human Eye anatomy, working, defects of vision (Myopia, Hypermetropia, Presbyopia), dispersion of light through a prism, and atmospheric refraction.'
          },
          {
            id: '10_sci_ref_3',
            lectureNumber: 'Lecture 03',
            title: 'Vidhut Class 10 ⚡ Complete Chapter in One Shot | Board Exam 2026',
            duration: '90 mins',
            youtubeId: 'WrtsWQpB7Kg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80',
            description: 'Comprehensive one-shot lecture covering Electric Current, Potential Difference, Ohm\'s Law, Resistance factors, Series and Parallel combinations, and Heating effects of current.'
          },
          {
            id: '10_sci_ref_4',
            lectureNumber: 'Lecture 04',
            title: 'Electric Current & Magnetism Explained 🔥 | Vidhut Dhara aur Chumbakatva',
            duration: '75 mins',
            youtubeId: 'YU6peT7ORM4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518152006812-cdff28b66580?auto=format&fit=crop&w=400&q=80',
            description: 'Understand Magnetic Effects of Electric Current, magnetic field lines, straight conductor, circular loop, solenoid, Fleming\'s left hand rule, and electric motor.'
          },
          {
            id: '10_sci_ref_5',
            lectureNumber: 'Lecture 05',
            title: 'Rasayanik Abhikriya aur Samikaran | NCERT Class 10 Science Hindi Medium',
            duration: '65 mins',
            youtubeId: 'Qw0-1HffQkE',
            thumbnailUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=400&q=80',
            description: 'Complete Hindi medium explanation of Chemical Reactions and Equations, balancing methods, types of chemical reactions, corrosion, and rancidity.'
          }
        ]
      },
      mathematics: {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Rigorous step-by-step problem-solving for Algebra, Geometry, and Trigonometry.',
        icon: '📐',
        color: 'from-blue-500 to-indigo-600',
        lectures: [
          {
            id: '10_math_1',
            lectureNumber: 'Lecture 01',
            title: 'Real Numbers - Euclid Division & Fundamental Theorem',
            duration: '42 mins',
            youtubeId: '37pA7S4B534',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
            description: 'Starting mathematics CBSE Class 10 with Real Numbers. Understanding LCM-HCF relations and proofs of irrationality of root primes.'
          },
          {
            id: '10_math_2',
            lectureNumber: 'Lecture 02',
            title: 'Polynomials - Roots & Geometrical Meanings',
            duration: '48 mins',
            youtubeId: 'K4w9aL2_o04',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
            description: 'Focus on relationship between coefficients and zeroes of quadratic polynomials, division algorithms, and graphical representation.'
          },
          {
            id: '10_math_3',
            lectureNumber: 'Lecture 03',
            title: 'Linear Equations in Two Variables - Algebraic Methods',
            duration: '62 mins',
            youtubeId: 'r5-fCkyiZJ8',
            thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
            description: 'Solving linear pairs using substitution, elimination, and cross-multiplication methods. Features extensive word problem practices.'
          },
          {
            id: '10_math_4',
            lectureNumber: 'Lecture 04',
            title: 'Quadratic Equations - Factoring & Quadratic Formula',
            duration: '55 mins',
            youtubeId: 'xG002X9Yh-g',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=400&q=80',
            description: 'Deriving the famous Shreedharacharya quadratic formula. Determining the nature of roots based on the Discriminant value.'
          },
          {
            id: '10_math_5',
            lectureNumber: 'Lecture 05',
            title: 'Arithmetic Progressions - Sum of N Terms',
            duration: '49 mins',
            youtubeId: 'Gz1BscC2k5I',
            thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
            description: 'Formula derivation for the general nth term and sum of first n terms of an AP with several standard board-exam exam applications.'
          }
        ]
      }
    }
  },
  {
    id: 'class_12',
    title: 'Class 12th Free Batch',
    tagline: 'Boards Booster & Advanced JEE/NEET Foundations',
    description: 'An advanced curriculum formulated for Class 12th science students. Tackle high-difficulty concepts in physics, chemistry, and calculus with rigorous explanations, boards writing patterns, and competitive exam short-cuts.',
    coverImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    enrolledText: '4.8k Students Enrolled',
    rating: '4.95 (250+ reviews)',
    subjects: {
      science: {
        id: 'science',
        name: 'Science',
        description: 'Advanced Physics electrostatic fields and critical Organic/Physical chemistry reactions.',
        icon: '🌌',
        color: 'from-purple-500 to-pink-600',
        lectures: [
          {
            id: '12_sci_1',
            lectureNumber: 'Lecture 01',
            title: 'Electrostatics - Coulomb\'s Law & Electric Dipole Field',
            duration: '75 mins',
            youtubeId: '63yvT6fM2C8',
            thumbnailUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=400&q=80',
            description: 'A deep dive into electric charges, continuous charge distribution, and calculating the electric field intensity on axial and equatorial points of a dipole.'
          },
          {
            id: '12_sci_2',
            lectureNumber: 'Lecture 02',
            title: 'Gauss Law - Flux Calculation & Infinite Sheet Fields',
            duration: '58 mins',
            youtubeId: 'R97v_n2A1sU',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=400&q=80',
            description: 'Understand electric flux conceptually. Prove Gauss law from Coulomb\'s law, and use it to find fields for straight wires, infinite sheets, and shells.'
          },
          {
            id: '12_sci_3',
            lectureNumber: 'Lecture 03',
            title: 'Chemical Kinetics - Order, Molecularity & Rate Laws',
            duration: '64 mins',
            youtubeId: '_Y41Y9V6X_Q',
            thumbnailUrl: 'https://images.unsplash.com/photo-1581093588401-f3c22d7a1f18?auto=format&fit=crop&w=400&q=80',
            description: 'Master rate expression writing, finding orders of reactions, difference between molecularity & order, and integrated rate equations for zero & first order reactions.'
          },
          {
            id: '12_sci_4',
            lectureNumber: 'Lecture 04',
            title: 'Coordination Compounds - Werner\'s Theory & Ligand Field',
            duration: '52 mins',
            youtubeId: 'q_HhF7UuOic',
            thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
            description: 'An informative chapter covering Werner\'s coordination theory, IUPAC naming rules, structural isomerism, and introductory Valence Bond theory.'
          },
          {
            id: '12_sci_5',
            lectureNumber: 'Lecture 05',
            title: 'Solid State - Unit Cell Packing Efficiency & Defects',
            duration: '44 mins',
            youtubeId: 'S75A_bCH34w',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80',
            description: 'Learn the geometric arrangements of crystalline solids, packing fractions of simple cubic, BCC, FCC structures, and crystal line defects.'
          }
        ]
      },
      mathematics: {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'High-level Calculus continuity, differentiation, and integration tricks.',
        icon: '📐',
        color: 'from-blue-600 to-cyan-600',
        lectures: [
          {
            id: '12_math_1',
            lectureNumber: 'Lecture 01',
            title: 'Relations & Functions - One-One, Onto & Composites',
            duration: '48 mins',
            youtubeId: 'n_V_hF1bOic',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
            description: 'Establish clear mappings. Master reflexive, symmetric, and transitive equivalence relations. Verify injective (one-one) and surjective (onto) properties.'
          },
          {
            id: '12_math_2',
            lectureNumber: 'Lecture 02',
            title: 'Inverse Trigonometric Functions - Principal Value Branches',
            duration: '62 mins',
            youtubeId: 'hXF7u6U2Z8c',
            thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
            description: 'Master trigonometric domain restrictions, graphing inverse sine/cosine curves, and practicing core substitution formulas for simplification.'
          },
          {
            id: '12_math_3',
            lectureNumber: 'Lecture 03',
            title: 'Matrices & Determinants - Cramer\'s Rule & Inverse',
            duration: '58 mins',
            youtubeId: 'm4X2-iI70U4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
            description: 'Matrix multiplication theorems, evaluating 3x3 determinants, finding adjoints & matrix inverses, and solving simultaneous linear equations.'
          },
          {
            id: '12_math_4',
            lectureNumber: 'Lecture 04',
            title: 'Continuity & Differentiability - Chain Rule & Logarithmic',
            duration: '74 mins',
            youtubeId: 'R97v_n2A1sU',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=400&q=80',
            description: 'Limits revision leading to continuity tests. Master advanced derivative tricks: chain rule, logarithmic differentiation, and parametric functions.'
          },
          {
            id: '12_math_5',
            lectureNumber: 'Lecture 05',
            title: 'Integral Calculus - Substitution & Standard Algebraic Forms',
            duration: '85 mins',
            youtubeId: 'b-HQ7g_SbyY',
            thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
            description: 'Kickstart integration by substitution. Solve classic standard integrals and apply algebraic reduction tools to simplify complex rational functions.'
          }
        ]
      }
    }
  }
];

