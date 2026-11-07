import { PrismaClient, Role, ApplicationStatus, NotificationType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo@12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@grantly.demo" },
    update: {},
    create: { name: "GRANTLY Admin", email: "admin@grantly.demo", passwordHash, role: Role.ADMIN, phone: "0000000000" },
  });
  const student = await prisma.user.upsert({
    where: { email: "student@grantly.demo" },
    update: {},
    create: { name: "Aarav Mehta", email: "student@grantly.demo", passwordHash, role: Role.STUDENT, phone: "9876543210" },
  });
  const providerUser = await prisma.user.upsert({
    where: { email: "provider@grantly.demo" },
    update: {},
    create: { name: "Future Scholars Foundation", email: "provider@grantly.demo", passwordHash, role: Role.PROVIDER },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      educationLevel: "Undergraduate",
      institution: "Demo Institute of Technology",
      degree: "B.Tech",
      course: "Computer Engineering",
      currentYear: "3rd Year",
      graduationYear: 2027,
      cgpa: 8.4,
      percentage: 84,
      state: "Maharashtra",
      city: "Mumbai",
      familyIncome: 450000,
      incomeCategory: "Low-Middle Income",
      skills: "Python, Web Development, Data Analysis",
      achievements: "Dean's List 2025, Hackathon finalist",
      completionPercent: 78,
    },
  });

  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: { userId: providerUser.id, organization: "Future Scholars Foundation", website: "https://example.org", verified: true, description: "Demo provider organization for GRANTLY hackathon presentation." },
  });

  const cats = [
    { name: "Merit-Based", slug: "merit-based" },
    { name: "Need-Based", slug: "need-based" },
    { name: "Government", slug: "government" },
    { name: "Private", slug: "private" },
    { name: "Women in STEM", slug: "women-in-stem" },
  ];
  const categories: Record<string, string> = {};
  for (const c of cats) {
    const row = await prisma.scholarshipCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
    categories[c.slug] = row.id;
  }

  const now = new Date();
  const days = (n: number) => new Date(now.getTime() + n * 86400000);
  const scholarships = [
    {
      title: "National Merit Advancement Scholarship (Demo)",
      providerName: "Ministry of Education (Sample)",
      organization: "Government Education Board",
      description: "SAMPLE DATA: Supports high-performing undergraduate students with demonstrated academic excellence and financial need. Verify all details on official portals before applying.",
      benefits: "Tuition support, mentorship access, annual stipend (illustrative).",
      amount: 120000, fundingType: "partial", categoryId: categories["merit-based"],
      educationLevels: "Undergraduate", eligibleCourses: "Engineering,Science,Management",
      eligibleStates: "All India", minCgpa: 7.5, maxFamilyIncome: 800000,
      requiredDocuments: "Academic transcripts,Income certificate,Identity document,Bonafide certificate",
      applicationProcedure: "Complete profile, verify eligibility, upload documents, submit application through official channel.",
      officialUrl: "https://example.org/demo-scholarship", applicationUrl: "https://example.org/demo-apply",
      deadline: days(14), openDate: days(-20), isDemo: true, isVerified: true, tags: "merit,government,undergraduate",
    },
    {
      title: "Future Engineers Need-Based Grant (Demo)",
      providerName: "Future Scholars Foundation",
      organization: "Future Scholars Foundation",
      description: "SAMPLE DATA: Financial assistance for engineering students from eligible income groups. This listing is seeded for demonstration.",
      benefits: "Partial fee coverage and learning resources.",
      amount: 75000, fundingType: "partial", categoryId: categories["need-based"], providerId: provider.id,
      educationLevels: "Undergraduate,Diploma", eligibleCourses: "Engineering,Computer Engineering",
      eligibleStates: "Maharashtra,Gujarat,Karnataka", minPercentage: 60, maxFamilyIncome: 500000,
      requiredDocuments: "Mark sheets,Income certificate,Identity document",
      applicationProcedure: "Register, complete profile, attach documents, submit before deadline.",
      officialUrl: "https://example.org/provider-demo", applicationUrl: "https://example.org/provider-apply",
      deadline: days(5), openDate: days(-10), isDemo: true, isVerified: true, tags: "need,engineering,private",
    },
    {
      title: "Women in Technology Excellence Award (Demo)",
      providerName: "Tech Inclusion Alliance (Sample)",
      organization: "Tech Inclusion Alliance",
      description: "SAMPLE DATA: Recognizes women pursuing technology and engineering programs with strong academic and leadership potential.",
      benefits: "Award amount, mentorship, community access (illustrative).",
      amount: 150000, fundingType: "partial", categoryId: categories["women-in-stem"],
      educationLevels: "Undergraduate,Postgraduate", eligibleCourses: "Computer Engineering,Engineering,Science",
      eligibleStates: "All India", minCgpa: 7.0,
      requiredDocuments: "Academic transcripts,Identity document,Statement of purpose,Recommendation letter",
      applicationProcedure: "Prepare documents, submit application, participate in review if shortlisted.",
      officialUrl: "https://example.org/women-stem-demo", applicationUrl: "https://example.org/women-stem-apply",
      deadline: days(30), openDate: days(-5), isDemo: true, isVerified: true, tags: "women,stem,merit",
    },
    {
      title: "State Postgraduate Research Support (Demo)",
      providerName: "State Higher Education Council (Sample)",
      organization: "State Higher Education Council",
      description: "SAMPLE DATA: Support for postgraduate students engaged in approved research programs.",
      benefits: "Research stipend and contingency support (illustrative).",
      amount: 200000, fundingType: "full", categoryId: categories["government"],
      educationLevels: "Postgraduate", eligibleCourses: "Science,Engineering,Management,Arts and Humanities",
      eligibleStates: "Maharashtra,Delhi,Tamil Nadu", minCgpa: 7.0,
      requiredDocuments: "Academic transcripts,Research proposal,Bonafide certificate,Identity document",
      applicationProcedure: "Submit proposal and institutional verification through official process.",
      officialUrl: "https://example.org/pg-demo", applicationUrl: "https://example.org/pg-apply",
      deadline: days(2), openDate: days(-25), isDemo: true, isVerified: true, tags: "postgraduate,research,government",
    },
    {
      title: "Private Undergraduate Opportunity Fund (Demo)",
      providerName: "Civic Growth Trust (Sample)",
      organization: "Civic Growth Trust",
      description: "SAMPLE DATA: General undergraduate support fund with broad eligibility. Always confirm official criteria.",
      benefits: "One-time education support.",
      amount: 50000, fundingType: "partial", categoryId: categories["private"],
      educationLevels: "Undergraduate", eligibleCourses: "Arts and Humanities,Science,Management,Engineering,Medical",
      eligibleStates: "All India", minPercentage: 55,
      requiredDocuments: "Mark sheets,Identity document",
      applicationProcedure: "Create account, complete profile, apply with required documents.",
      officialUrl: "https://example.org/private-demo", applicationUrl: "https://example.org/private-apply",
      deadline: days(45), openDate: days(-2), isDemo: true, isVerified: false, tags: "private,undergraduate",
    },
  ];

  for (const s of scholarships) {
    await prisma.scholarship.create({ data: s }).catch(() => null);
  }

  const firstScholarship = await prisma.scholarship.findFirst();
  if (firstScholarship) {
    await prisma.savedScholarship.upsert({
      where: { userId_scholarshipId: { userId: student.id, scholarshipId: firstScholarship.id } },
      update: {},
      create: { userId: student.id, scholarshipId: firstScholarship.id },
    });
    const app = await prisma.application.upsert({
      where: { userId_scholarshipId: { userId: student.id, scholarshipId: firstScholarship.id } },
      update: {},
      create: { userId: student.id, scholarshipId: firstScholarship.id, status: ApplicationStatus.SUBMITTED, submittedAt: days(-1) },
    });
    await prisma.applicationStatusHistory.createMany({ data: [
      { applicationId: app.id, status: ApplicationStatus.DRAFT, note: "Draft created." },
      { applicationId: app.id, status: ApplicationStatus.SUBMITTED, note: "Application submitted (demo)." },
    ]}).catch(() => null);
  }

  await prisma.notification.createMany({
    data: [
      { userId: student.id, type: NotificationType.MATCH, title: "New matching scholarships", message: "GRANTLY found demo scholarships that may fit your profile.", href: "/student/recommended" },
      { userId: student.id, type: NotificationType.DEADLINE, title: "Deadline approaching", message: "A saved demo scholarship closes soon. Review requirements.", href: "/student/saved" },
      { userId: student.id, type: NotificationType.PROFILE, title: "Complete your profile", message: "Add missing details to improve eligibility checks.", href: "/student/profile" },
    ],
  }).catch(() => null);

  console.log("Seed complete. Demo accounts: admin@grantly.demo / student@grantly.demo / provider@grantly.demo (Demo@12345)");
}

main().finally(() => prisma.$disconnect());
