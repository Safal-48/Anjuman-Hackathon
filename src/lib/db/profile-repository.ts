import {
  FullUserProfile,
  StudentSkillEntity,
  ProjectEntity,
  CertificationEntity,
  AchievementEntity,
  DocumentEntity,
  SkillLevel,
  AchievementCategory,
} from "@/lib/supabase/types";
import { getUserById, saveUser, DEMO_USERS } from "@/lib/auth/session";
import { UserProfile } from "@/lib/auth/types";

// In-memory relational tables store
const globalRelationalStore = global as unknown as {
  _titanSkills?: Map<string, StudentSkillEntity>;
  _titanProjects?: Map<string, ProjectEntity>;
  _titanCertifications?: Map<string, CertificationEntity>;
  _titanAchievements?: Map<string, AchievementEntity>;
  _titanDocuments?: Map<string, DocumentEntity>;
};

if (!globalRelationalStore._titanSkills) {
  globalRelationalStore._titanSkills = new Map<string, StudentSkillEntity>();
  globalRelationalStore._titanProjects = new Map<string, ProjectEntity>();
  globalRelationalStore._titanCertifications = new Map<string, CertificationEntity>();
  globalRelationalStore._titanAchievements = new Map<string, AchievementEntity>();
  globalRelationalStore._titanDocuments = new Map<string, DocumentEntity>();

  // Pre-seed demo student relational entities
  const studentDemoId = DEMO_USERS["student@titan.ai"].id;

  const defaultSkills: Array<{ name: string; level: SkillLevel; score: number; category: string }> = [
    { name: "React / Next.js", level: "expert", score: 95, category: "Web Systems" },
    { name: "TypeScript", level: "expert", score: 92, category: "Web Systems" },
    { name: "Python & PyTorch", level: "advanced", score: 88, category: "AI & Machine Learning" },
    { name: "Distributed Systems", level: "advanced", score: 85, category: "Cloud & DevOps" },
    { name: "Docker & Kubernetes", level: "intermediate", score: 78, category: "Cloud & DevOps" },
    { name: "Three.js / WebGL", level: "intermediate", score: 75, category: "Graphics & 3D" },
  ];

  defaultSkills.forEach((s) => {
    const id = `skill-${Math.random().toString(36).substring(2, 9)}`;
    globalRelationalStore._titanSkills!.set(id, {
      id,
      studentId: studentDemoId,
      skillName: s.name,
      level: s.level,
      proficiencyScore: s.score,
      category: s.category,
      isVerified: true,
      createdAt: new Date().toISOString(),
    });
  });

  const demoProject: ProjectEntity = {
    id: `proj-${Math.random().toString(36).substring(2, 9)}`,
    userId: studentDemoId,
    title: "Neural Vision Telemetry Core",
    summary: "Real-time edge computing vision pipeline processing 120 FPS camera streams with sub-10ms inference latency.",
    techStack: ["PyTorch", "Next.js", "TypeScript", "TensorRT", "Docker"],
    liveUrl: "https://vision-telemetry.titan.ai",
    repoUrl: "https://github.com/tech-titan/vision-telemetry",
    startDate: "2025-09-01",
    endDate: "2026-02-15",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  globalRelationalStore._titanProjects!.set(demoProject.id, demoProject);

  const demoCert: CertificationEntity = {
    id: `cert-${Math.random().toString(36).substring(2, 9)}`,
    userId: studentDemoId,
    title: "AWS Certified Solutions Architect - Associate",
    issuingOrganization: "Amazon Web Services",
    issueDate: "2025-06-15",
    credentialId: "AWS-SAA-8839210",
    credentialUrl: "https://aws.amazon.com/verification",
    createdAt: new Date().toISOString(),
  };
  globalRelationalStore._titanCertifications!.set(demoCert.id, demoCert);

  const demoAchievement: AchievementEntity = {
    id: `achieve-${Math.random().toString(36).substring(2, 9)}`,
    userId: studentDemoId,
    title: "National Smart India Hackathon Finalist",
    category: "hackathon",
    description: "Engineered scalable AI telemetry architecture for Problem Statement 26044.",
    dateAchieved: "2026-03-01",
    proofUrl: "https://sih.gov.in",
    createdAt: new Date().toISOString(),
  };
  globalRelationalStore._titanAchievements!.set(demoAchievement.id, demoAchievement);

  const demoDoc: DocumentEntity = {
    id: `doc-${Math.random().toString(36).substring(2, 9)}`,
    userId: studentDemoId,
    title: "Aarav_Sharma_Resume.pdf",
    type: "resume",
    fileUrl: "https://example.com/resumes/aarav-sharma.pdf",
    fileSizeBytes: 245000,
    mimeType: "application/pdf",
    createdAt: new Date().toISOString(),
  };
  globalRelationalStore._titanDocuments!.set(demoDoc.id, demoDoc);
}

/**
 * Calculates a dynamic career readiness score (0 - 100) based on verified skills, projects, and credentials
 */
export function calculateReadinessScore(skillsCount: number, projectsCount: number, certsCount: number): number {
  let score = 50; // base score for registered profile
  score += Math.min(skillsCount * 5, 25);
  score += Math.min(projectsCount * 10, 20);
  score += Math.min(certsCount * 5, 10);
  return Math.min(score, 100);
}

/**
 * Fetch full user profile with all relational entities
 */
export async function getFullProfile(userId: string): Promise<FullUserProfile | null> {
  const user = getUserById(userId);
  if (!user) return null;

  const skills = Array.from(globalRelationalStore._titanSkills!.values()).filter((s) => s.studentId === userId);
  const projects = Array.from(globalRelationalStore._titanProjects!.values()).filter((p) => p.userId === userId);
  const certifications = Array.from(globalRelationalStore._titanCertifications!.values()).filter((c) => c.userId === userId);
  const achievements = Array.from(globalRelationalStore._titanAchievements!.values()).filter((a) => a.userId === userId);
  const documents = Array.from(globalRelationalStore._titanDocuments!.values()).filter((d) => d.userId === userId);

  const readinessScore = calculateReadinessScore(skills.length, projects.length, certifications.length);

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: undefined,
    bio: user.bio || user.studentProfile?.careerGoal || user.industryProfile?.organizationDescription || undefined,
    location: user.location || (user.institutionProfile ? `${user.institutionProfile.city}, ${user.institutionProfile.state}` : "India"),
    role: user.role,
    isOnboarded: user.isOnboarded,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    studentProfile: user.studentProfile ? {
      education: user.studentProfile.education,
      institution: user.studentProfile.institution,
      academicYear: user.studentProfile.academicYear,
      careerGoal: user.studentProfile.careerGoal,
      experienceSummary: user.studentProfile.experience,
      readinessScore,
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
    } : undefined,
    industryProfile: user.industryProfile,
    academicianProfile: user.academicianProfile,
    institutionProfile: user.institutionProfile,
    skills,
    projects,
    certifications,
    achievements,
    documents,
  };
}

/**
 * Update core profile metadata
 */
export async function updateCoreProfile(userId: string, data: {
  fullName?: string;
  bio?: string;
  location?: string;
  careerGoal?: string;
  education?: string;
  academicYear?: string;
  organizationName?: string;
  industryDomain?: string;
}): Promise<FullUserProfile | null> {
  const user = getUserById(userId);
  if (!user) return null;

  if (data.fullName) user.fullName = data.fullName.trim();
  if (data.location) user.location = data.location.trim();
  if (data.bio) user.bio = data.bio.trim();
  if (user.studentProfile) {
    if (data.careerGoal) user.studentProfile.careerGoal = data.careerGoal.trim();
    if (data.education) user.studentProfile.education = data.education.trim();
    if (data.academicYear) user.studentProfile.academicYear = data.academicYear.trim();
  }
  if (user.industryProfile) {
    if (data.organizationName) user.industryProfile.organizationName = data.organizationName.trim();
    if (data.industryDomain) user.industryProfile.industryDomain = data.industryDomain.trim();
  }

  user.updatedAt = new Date().toISOString();
  saveUser(user);

  return getFullProfile(userId);
}

/**
 * Add or update a student skill
 */
export async function addStudentSkill(
  userId: string,
  data: { skillName: string; level?: SkillLevel; proficiencyScore?: number; category?: string }
): Promise<StudentSkillEntity> {
  const existing = Array.from(globalRelationalStore._titanSkills!.values()).find(
    (s) => s.studentId === userId && s.skillName.toLowerCase() === data.skillName.toLowerCase().trim()
  );

  if (existing) {
    existing.level = data.level || existing.level;
    existing.proficiencyScore = data.proficiencyScore || existing.proficiencyScore;
    existing.category = data.category || existing.category;
    return existing;
  }

  const newSkill: StudentSkillEntity = {
    id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    studentId: userId,
    skillName: data.skillName.trim(),
    level: data.level || "intermediate",
    proficiencyScore: data.proficiencyScore || 75,
    category: data.category || "Core Engineering",
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  globalRelationalStore._titanSkills!.set(newSkill.id, newSkill);
  return newSkill;
}

/**
 * Delete a student skill
 */
export async function deleteStudentSkill(userId: string, skillId: string): Promise<boolean> {
  const skill = globalRelationalStore._titanSkills!.get(skillId);
  if (!skill || skill.studentId !== userId) return false;
  return globalRelationalStore._titanSkills!.delete(skillId);
}

/**
 * Create a portfolio project
 */
export async function createProject(
  userId: string,
  data: { title: string; summary: string; techStack?: string[]; liveUrl?: string; repoUrl?: string; isFeatured?: boolean }
): Promise<ProjectEntity> {
  const newProject: ProjectEntity = {
    id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title: data.title.trim(),
    summary: data.summary.trim(),
    techStack: data.techStack || ["TypeScript", "Next.js"],
    liveUrl: data.liveUrl,
    repoUrl: data.repoUrl,
    isFeatured: Boolean(data.isFeatured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalRelationalStore._titanProjects!.set(newProject.id, newProject);
  return newProject;
}

/**
 * Update an existing project
 */
export async function updateProject(
  userId: string,
  projectId: string,
  data: Partial<ProjectEntity>
): Promise<ProjectEntity | null> {
  const project = globalRelationalStore._titanProjects!.get(projectId);
  if (!project || project.userId !== userId) return null;

  Object.assign(project, data, { updatedAt: new Date().toISOString() });
  return project;
}

/**
 * Delete a project
 */
export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
  const project = globalRelationalStore._titanProjects!.get(projectId);
  if (!project || project.userId !== userId) return false;
  return globalRelationalStore._titanProjects!.delete(projectId);
}

/**
 * Add a certification
 */
export async function addCertification(
  userId: string,
  data: { title: string; issuingOrganization: string; credentialId?: string; credentialUrl?: string; issueDate?: string }
): Promise<CertificationEntity> {
  const newCert: CertificationEntity = {
    id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title: data.title.trim(),
    issuingOrganization: data.issuingOrganization.trim(),
    credentialId: data.credentialId,
    credentialUrl: data.credentialUrl,
    issueDate: data.issueDate || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  globalRelationalStore._titanCertifications!.set(newCert.id, newCert);
  return newCert;
}

/**
 * Delete a certification
 */
export async function deleteCertification(userId: string, certId: string): Promise<boolean> {
  const cert = globalRelationalStore._titanCertifications!.get(certId);
  if (!cert || cert.userId !== userId) return false;
  return globalRelationalStore._titanCertifications!.delete(certId);
}

/**
 * Add an achievement
 */
export async function addAchievement(
  userId: string,
  data: { title: string; category?: AchievementCategory; description: string; proofUrl?: string }
): Promise<AchievementEntity> {
  const newAchievement: AchievementEntity = {
    id: `achieve-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title: data.title.trim(),
    category: data.category || "hackathon",
    description: data.description.trim(),
    proofUrl: data.proofUrl,
    dateAchieved: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  globalRelationalStore._titanAchievements!.set(newAchievement.id, newAchievement);
  return newAchievement;
}

/**
 * Delete an achievement
 */
export async function deleteAchievement(userId: string, achievementId: string): Promise<boolean> {
  const achievement = globalRelationalStore._titanAchievements!.get(achievementId);
  if (!achievement || achievement.userId !== userId) return false;
  return globalRelationalStore._titanAchievements!.delete(achievementId);
}
