import {
  BookOpen, BrainCircuit, MessageSquare, Calendar,
  Star, Users, TrendingUp, GraduationCap, ClipboardList,
  Code2, FlaskConical, BookMarked,
} from 'lucide-react';

// ─── Team Batches Data ─────────────────────────────────────────────────────────
export interface BatchMember { name: string; subject?: string; }
export interface Batch {
  id: string;
  label: string;
  academicYear: string;
  current: boolean;
  yearManager: BatchMember;
  followupManager: BatchMember;
  subjectManagers: BatchMember[];
  scientificMembers: BatchMember[];
  technicalMembers: BatchMember[];
}

export const BATCHES: Batch[] = [
  {
    id: '25',
    label: 'الدفعة 25',
    academicYear: '2024 / 2025',
    current: true,
    yearManager:      { name: 'أحمد محمد حسن' },
    followupManager:  { name: 'سارة عبدالله المصري' },
    subjectManagers: [
      { name: 'عمر علي ناصر',      subject: 'رياضيات' },
      { name: 'لينا يوسف سالم',    subject: 'فيزياء' },
      { name: 'خالد إبراهيم حسن',  subject: 'برمجة وخوارزميات' },
      { name: 'نور خليل محمد',     subject: 'قواعد البيانات' },
      { name: 'ريم أحمد فاروق',    subject: 'شبكات' },
      { name: 'يزيد سامي الحسيني', subject: 'ذكاء اصطناعي' },
    ],
    scientificMembers: [
      { name: 'يوسف الرشيد' }, { name: 'فاطمة إبراهيم' },
      { name: 'حسن علي طه' },  { name: 'دينا سامح رضا' },
      { name: 'مريم صالح' },   { name: 'طارق عمر فتحي' },
    ],
    technicalMembers: [
      { name: 'رامي حسن عبده' }, { name: 'آية محمد فريد' },
      { name: 'تامر الشرقاوي' }, { name: 'إيمان كريم' },
    ],
  },
  {
    id: '24',
    label: 'الدفعة 24',
    academicYear: '2023 / 2024',
    current: false,
    yearManager:      { name: 'محمود عادل نور' },
    followupManager:  { name: 'هبة محمد الشافعي' },
    subjectManagers: [
      { name: 'أنس كريم طه',       subject: 'رياضيات' },
      { name: 'غادة رضا السيد',    subject: 'فيزياء' },
      { name: 'بلال حسام الدين',   subject: 'برمجة وخوارزميات' },
      { name: 'منى أيمن الفقي',    subject: 'قواعد البيانات' },
      { name: 'عبدالله وليد نصر',  subject: 'شبكات' },
    ],
    scientificMembers: [
      { name: 'إسلام أحمد فتحي' }, { name: 'رنا محمد عامر' },
      { name: 'كريم عبداللطيف' },  { name: 'نهى عصام شعبان' },
      { name: 'أحمد سعد الدين' },
    ],
    technicalMembers: [
      { name: 'ماهر وائل رفاعي' }, { name: 'شيماء خالد عمر' },
      { name: 'ياسر حنفي محمد' },
    ],
  },
  {
    id: '23',
    label: 'الدفعة 23',
    academicYear: '2022 / 2023',
    current: false,
    yearManager:      { name: 'سامح مصطفى علي' },
    followupManager:  { name: 'دينا حازم حسين' },
    subjectManagers: [
      { name: 'عمرو محسن جبر',    subject: 'رياضيات' },
      { name: 'ياسمين فكري سعد',  subject: 'فيزياء' },
      { name: 'حاتم أشرف حسن',   subject: 'برمجة وخوارزميات' },
      { name: 'مي سامي نشأت',     subject: 'قواعد البيانات' },
    ],
    scientificMembers: [
      { name: 'أحمد حمدي رضا' }, { name: 'نيفين مجدي طاهر' },
      { name: 'محمد عصام بكر' }, { name: 'سمر وليد صالح' },
    ],
    technicalMembers: [
      { name: 'أشرف رشاد عمر' }, { name: 'مروة سالم أحمد' },
    ],
  },
  {
    id: '22',
    label: 'الدفعة 22',
    academicYear: '2021 / 2022',
    current: false,
    yearManager:      { name: 'إبراهيم توفيق عبدالله' },
    followupManager:  { name: 'رانيا كمال إبراهيم' },
    subjectManagers: [
      { name: 'وائل نبيل حنا',     subject: 'رياضيات' },
      { name: 'إيناس شريف لطفي',  subject: 'فيزياء' },
      { name: 'مصطفى عزمي صادق', subject: 'برمجة وخوارزميات' },
    ],
    scientificMembers: [
      { name: 'هاني سمير عبده' },  { name: 'علا محمد طلعت' },
      { name: 'وسيم أحمد دياب' },
    ],
    technicalMembers: [
      { name: 'نضال محمود عثمان' }, { name: 'سلمى عاطف رشاد' },
    ],
  },
];

export const featuresData = [
  { icon: BookOpen,      title: 'Smart Lectures',    desc: 'Access recorded lectures by subject. Available free — no login required.',   accent: '#404293', num: '01', free: true,  path: '/app/lectures' },
  { icon: Calendar,      title: 'Exam Scheduling',   desc: 'Build a personalized exam schedule from the official timetable.',              accent: '#33529F', num: '02', free: false, path: '/app/exams/official' },
  { icon: BrainCircuit,  title: 'MCQ Practice',      desc: 'Adaptive multiple-choice questions with instant feedback and tracking.',       accent: '#2376BB', num: '03', free: false, path: '/app/mcq' },
  { icon: MessageSquare, title: 'AI Assistant',      desc: 'Your personal academic assistant, available 24/7 to answer any question.',    accent: '#404293', num: '04', free: false, path: '/app/chatbot' },
  { icon: ClipboardList, title: 'Task Manager',      desc: 'Organize tasks with a built-in to-do list and Pomodoro timer.',               accent: '#33529F', num: '05', free: false, path: '/app/todo' },
  { icon: TrendingUp,    title: 'Progress Tracking', desc: 'Visualize your learning journey with detailed performance analytics.',        accent: '#2376BB', num: '06', free: false, path: '/app' },
];

export const statsData = [
  { value: '2,500+', label: 'Active Students', icon: Users      },
  { value: '150+',   label: 'Lectures',        icon: BookOpen   },
  { value: '5,000+', label: 'MCQ Questions',   icon: BrainCircuit },
  { value: '98%',    label: 'Satisfaction',    icon: Star       },
];

export const ROLE_CONFIG = [
  { key: 'yearManager',      label: 'مسؤول السنة',       icon: GraduationCap, color: '#404293', bg: '#EEF2FF', single: true  },
  { key: 'followupManager',  label: 'مسؤول المتابعة',    icon: ClipboardList, color: '#33529F', bg: '#EEF4FF', single: true  },
  { key: 'subjectManagers',  label: 'مسؤولو المواد',     icon: BookMarked,    color: '#2376BB', bg: '#EFF6FF', single: false },
  { key: 'scientificMembers',label: 'الأعضاء العلميون',  icon: FlaskConical,  color: '#059669', bg: '#ECFDF5', single: false },
  { key: 'technicalMembers', label: 'الأعضاء التقنيون',  icon: Code2,         color: '#7C3AED', bg: '#F5F3FF', single: false },
];
