export interface SorterItem {
  id: string;
  expression: string;
  expectedType: 'int' | 'float' | 'str' | 'bool';
  explanation: string;
}

export const SORTER_ITEMS: SorterItem[] = [
  { id: 's1', expression: '42', expectedType: 'int', explanation: '42 เป็นจำนวนเต็ม ไม่มีจุดทศนิยม จัดเป็น int' },
  { id: 's2', expression: '3.14159', expectedType: 'float', explanation: '3.14159 มีจุดทศนิยม จัดเป็น float' },
  { id: 's3', expression: '"False"', expectedType: 'str', explanation: '"False" อยู่ในเครื่องหมายคำพูด ถือเป็นข้อความ (str) ไม่ใช่ bool' },
  { id: 's4', expression: 'True', expectedType: 'bool', explanation: 'True คือค่าความจริงในภาษา Python จัดเป็น bool' },
  { id: 's5', expression: '0.0', expectedType: 'float', explanation: 'แม้ค่าจะเป็นศูนย์ แต่มีจุดทศนิยม (.0) จึงจัดเป็น float' },
  { id: 's6', expression: '-150', expectedType: 'int', explanation: 'จำนวนเต็มลบ เช่น -150 จัดเป็น int' },
  { id: 's7', expression: "'สวัสดี'", expectedType: 'str', explanation: 'ข้อความในเครื่องหมายคำพูดเดี่ยว เป็น str' },
  { id: 's8', expression: 'False', expectedType: 'bool', explanation: 'False คือค่าเท็จใน Python จัดเป็น bool' },
  { id: 's9', expression: '"100"', expectedType: 'str', explanation: 'ตัวเลขที่ถูกครอบด้วยเครื่องหมายคำพูด ถือเป็น str' },
  { id: 's10', expression: '99.9', expectedType: 'float', explanation: 'ตัวเลขทศนิยม จัดเป็น float' },
  { id: 's11', expression: '0', expectedType: 'int', explanation: 'ศูนย์เดี่ยวๆ ไม่มีจุดทศนิยม จัดเป็น int' },
  { id: 's12', expression: 'float(5)', expectedType: 'float', explanation: 'ฟังก์ชัน float(5) แปลง 5 เป็น 5.0 จึงเป็น float' },
  { id: 's13', expression: '"True"', expectedType: 'str', explanation: 'มีเครื่องหมายคำพูดครอบคำว่า True จึงเป็น str' },
  { id: 's14', expression: '10 / 2', expectedType: 'float', explanation: 'ตัวดำเนินการหาร (/) ใน Python ให้ผลลัพธ์เป็น float เสมอ (5.0)' },
  { id: 's15', expression: 'int("20")', expectedType: 'int', explanation: 'ฟังก์ชัน int("20") แปลงข้อความ "20" เป็นจำนวนเต็ม 20' },
  { id: 's16', expression: 'bool(1)', expectedType: 'bool', explanation: 'ฟังก์ชัน bool(1) คืนค่า True ซึ่งเป็น bool' },
  { id: 's17', expression: '-0.25', expectedType: 'float', explanation: 'ทศนิยมติดลบ เป็น float' },
  { id: 's18', expression: '"Python 3.12"', expectedType: 'str', explanation: 'ข้อความที่มีทั้งตัวอักษรและตัวเลข เป็น str' }
];

export interface DetectiveItem {
  id: string;
  varName: string;
  isValid: boolean;
  reason: string;
}

export const DETECTIVE_ITEMS: DetectiveItem[] = [
  { id: 'd1', varName: 'student_score', isValid: true, reason: 'ถูกต้อง: ขึ้นต้นด้วยตัวอักษรและคั่นด้วย _ ตามแบบ snake_case' },
  { id: 'd2', varName: '1st_place', isValid: false, reason: 'ผิดกฎ: ห้ามขึ้นต้นชื่อตัวแปรด้วยตัวเลข (SyntaxError)' },
  { id: 'd3', varName: '_secret_key', isValid: true, reason: 'ถูกต้อง: ชื่อตัวแปรสามารถขึ้นต้นด้วยเครื่องหมายขีดล่าง (_) ได้' },
  { id: 'd4', varName: 'total-amount', isValid: false, reason: 'ผิดกฎ: ห้ามใช้เครื่องหมายลบ (-) เพราะโปรแกรมมองเป็นตัวดำเนินการทางคณิตศาสตร์' },
  { id: 'd5', varName: 'user name', isValid: false, reason: 'ผิดกฎ: ห้ามมีช่องว่าง (Space) ในชื่อตัวแปร' },
  { id: 'd6', varName: 'class', isValid: false, reason: 'ผิดกฎ: "class" เป็นคำสงวน (Reserved Keyword) ในภาษา Python' },
  { id: 'd7', varName: 'score_2026', isValid: true, reason: 'ถูกต้อง: ตัวเลขสามารถอยู่ตรงกลางหรือท้ายชื่อตัวแปรได้' },
  { id: 'd8', varName: 'for', isValid: false, reason: 'ผิดกฎ: "for" เป็นคำสงวนที่ใช้สำหรับการวนลูป ห้ามใช้ตั้งชื่อตัวแปร' },
  { id: 'd9', varName: 'MAX_LIMIT', isValid: true, reason: 'ถูกต้อง: ตัวพิมพ์ใหญ่ล้วนใช้ได้ นิยมใช้สำหรับค่าคงที่ (Constant)' },
  { id: 'd10', varName: 'price$', isValid: false, reason: 'ผิดกฎ: ห้ามใช้อักขระพิเศษ เช่น $ ในชื่อตัวแปร' },
  { id: 'd11', varName: 'while_loop', isValid: true, reason: 'ถูกต้อง: แม้มีคำว่า while แต่ประกอบคำด้วย _loop จึงไม่ใช่คำสงวน' },
  { id: 'd12', varName: 'True', isValid: false, reason: 'ผิดกฎ: "True" เป็นคำสงวนประเภทค่าความจริงของ Python' },
  { id: 'd13', varName: 'studentName', isValid: true, reason: 'ถูกต้อง: รูปแบบ camelCase ใช้งานได้สมบูรณ์ใน Python' },
  { id: 'd14', varName: 'item#1', isValid: false, reason: 'ผิดกฎ: เครื่องหมาย # คือการเริ่มต้น Comment ใน Python ไม่สามารถอยู่ในชื่อตัวแปรได้' }
];

export interface LabChallenge {
  id: string;
  code: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export const LAB_CHALLENGES: LabChallenge[] = [
  {
    id: 'l1',
    code: 'a = "10"\nb = "25"\nprint(a + b)',
    question: 'ผลลัพธ์ของ print(a + b) คืออะไร?',
    options: [
      { text: '35', isCorrect: false },
      { text: '"1025"', isCorrect: true },
      { text: '"35"', isCorrect: false },
      { text: 'เกิด Error', isCorrect: false }
    ],
    explanation: 'เมื่อทั้ง a และ b เป็นสตริง เครื่องหมาย + จะนำตัวอักษรมาเชื่อมต่อกัน ได้ "1025"'
  },
  {
    id: 'l2',
    code: 'x = int(5.9)\nprint(x)',
    question: 'ฟังก์ชัน int() กระทำอย่างไรกับตัวเลข 5.9?',
    options: [
      { text: '6 (ปัดเศษขึ้น)', isCorrect: false },
      { text: '5 (ตัดเศษทิ้ง)', isCorrect: true },
      { text: '5.0', isCorrect: false },
      { text: 'เกิด ValueError', isCorrect: false }
    ],
    explanation: 'int() จะ "ตัดเศษทศนิยมทิ้งทันที" (Truncate) ไม่มีการปัดเศษ ดังนั้น 5.9 จะกลายเป็น 5'
  },
  {
    id: 'l3',
    code: 'laugh = "ฮ่า" * 3\nprint(laugh)',
    question: 'ผลลัพธ์ของตัวแปร laugh คืออะไร?',
    options: [
      { text: '"ฮ่าฮ่าฮ่า"', isCorrect: true },
      { text: '"ฮ่า 3"', isCorrect: false },
      { text: 'เกิด TypeError', isCorrect: false },
      { text: '"ฮ่า*3"', isCorrect: false }
    ],
    explanation: 'สตริง * จำนวนเต็ม คือการนำข้อความนั้นมาทำซ้ำตามจำนวนรอบที่ระบุ จึงได้ "ฮ่าฮ่าฮ่า"'
  },
  {
    id: 'l4',
    code: 'val = bool("")\nprint(val)',
    question: 'ข้อความว่าง (Empty String) แปลงเป็น bool แล้วได้ค่าใด?',
    options: [
      { text: 'True', isCorrect: false },
      { text: 'False', isCorrect: true },
      { text: 'None', isCorrect: false },
      { text: '0', isCorrect: false }
    ],
    explanation: 'ใน Python สตริงว่าง "" มีความยาวเป็น 0 จึงถูกประเมินเป็น False เสมอ'
  },
  {
    id: 'l5',
    code: 'print(10 // 3, 10 % 3)',
    question: 'ผลลัพธ์ของการหารปัดเศษลง (//) และการหารเอาเศษ (%) คือข้อใด?',
    options: [
      { text: '3 1', isCorrect: true },
      { text: '3.33 1', isCorrect: false },
      { text: '1 3', isCorrect: false },
      { text: '3.0 1.0', isCorrect: false }
    ],
    explanation: '10 // 3 ได้ผลลัพธ์จำนวนเต็ม 3 และ 10 % 3 ได้เศษเหลือจากการหารคือ 1'
  }
];
