import { Question } from '../types';

export const PRE_TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'types',
    categoryTitle: 'ชนิดของข้อมูล (Data Types)',
    title: 'ตัวแปร x = 45.0 ถูกจัดเป็นข้อมูลชนิดใดในภาษา Python?',
    codeSnippet: `x = 45.0\nprint(type(x))`,
    options: [
      { id: 'a', text: 'int (Integer)', isCorrect: false },
      { id: 'b', text: 'float (Floating Point)', isCorrect: true },
      { id: 'c', text: 'str (String)', isCorrect: false },
      { id: 'd', text: 'number', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! เนื่องจากมีจุดทศนิยม (.0) แม้จะไม่มีเศษทศนิยมอื่นก็ตาม ในภาษา Python จะจัดเป็นข้อมูลชนิด float ทันที',
    conceptTip: 'จุดทศนิยมเป็นตัวบ่งบอกชนิด float เสมอ หากต้องการ int จะต้องเป็นจำนวนเต็มล้วนไม่มีจุด เช่น 45'
  },
  {
    id: 2,
    category: 'naming',
    categoryTitle: 'กฎการตั้งชื่อ (Naming Rules)',
    title: 'ชื่อตัวแปรในข้อใดต่อไปนี้ "ผิดกฎ" การตั้งชื่อตัวแปรในภาษา Python?',
    options: [
      { id: 'a', text: '_student_id', isCorrect: false },
      { id: 'b', text: 'student_score_2', isCorrect: false },
      { id: 'c', text: '2nd_score', isCorrect: true },
      { id: 'd', text: 'totalPrice', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! เพราะชื่อตัวแปรใน Python ห้ามขึ้นต้นด้วยตัวเลขเด็ดขาด (การขึ้นต้นด้วย 2 จะทำให้เกิด SyntaxError)',
    conceptTip: 'กฎเหล็ก: ชื่อตัวแปรต้องขึ้นต้นด้วยตัวอักษรภาษาอังกฤษ (a-z, A-Z) หรือ _ เท่านั้น'
  },
  {
    id: 3,
    category: 'types',
    categoryTitle: 'ชนิดของข้อมูล (Data Types)',
    title: 'ข้อใดเก็บข้อมูลชนิดบูลีน (bool) ได้ถูกต้องตามหลักไวยากรณ์ Python?',
    options: [
      { id: 'a', text: 'is_passed = True', isCorrect: true },
      { id: 'b', text: 'is_passed = true', isCorrect: false },
      { id: 'c', text: 'is_passed = "True"', isCorrect: false },
      { id: 'd', text: 'is_passed = TRUE', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! ใน Python ค่าบูลีนมีเพียง 2 ค่า คือ True และ False ซึ่ง "ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่" เสมอ',
    conceptTip: 'ระวัง: true (พิมพ์เล็ก) จะถูกมองเป็นชื่อตัวแปรที่ไม่ได้ประกาศ และ "True" จะเป็นชนิด str (ข้อความ)'
  },
  {
    id: 4,
    category: 'casting',
    categoryTitle: 'การแปลงชนิดข้อมูล (Type Casting)',
    title: 'ผลลัพธ์ของโค้ดโปรแกรมด้านล่างนี้คือข้อใด?',
    codeSnippet: `a = "20"\nb = "30"\nprint(a + b)`,
    options: [
      { id: 'a', text: '50', isCorrect: false },
      { id: 'b', text: '2030', isCorrect: true },
      { id: 'c', text: '"50"', isCorrect: false },
      { id: 'd', text: 'เกิด TypeError', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! เนื่องจากทั้ง a และ b มีเครื่องหมายคำพูด จึงเป็นข้อความ (str) เมื่อใช้เครื่องหมาย + จะเป็นการนำข้อความมาต่อกัน ได้ "2030"',
    conceptTip: 'หากต้องการผลลัพธ์ 50 จะต้องแปลงชนิดข้อมูลก่อนบวก เช่น int(a) + int(b)'
  },
  {
    id: 5,
    category: 'naming',
    categoryTitle: 'คำสงวน (Reserved Keywords)',
    title: 'คำใดต่อไปนี้เป็น "คำสงวน" (Reserved Keyword) ที่ห้ามนำมาตั้งเป็นชื่อตัวแปร?',
    options: [
      { id: 'a', text: 'variable', isCorrect: false },
      { id: 'b', text: 'total', isCorrect: false },
      { id: 'c', text: 'class', isCorrect: true },
      { id: 'd', text: 'name', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! "class" เป็นคำสงวนใน Python ใช้สำหรับการสร้าง Class ในแนวคิดเชิงวัตถุ (OOP) จึงห้ามนำมาใช้ตั้งชื่อตัวแปร',
    conceptTip: 'คำสงวนที่พบบ่อย: if, else, elif, for, while, def, return, class, import, in, is, True, False, None'
  },
  {
    id: 6,
    category: 'operators',
    categoryTitle: 'ตัวดำเนินการ (Operators)',
    title: 'ผลลัพธ์ของคำสั่ง print(15 / 3) คือข้อใด?',
    codeSnippet: `print(15 / 3)`,
    options: [
      { id: 'a', text: '5', isCorrect: false },
      { id: 'b', text: '5.0', isCorrect: true },
      { id: 'c', text: '5.00', isCorrect: false },
      { id: 'd', text: 'เกิด ZeroDivisionError', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! ใน Python 3 ตัวดำเนินการหารแบบ / จะคืนค่าเป็นทศนิยม (float) เสมอ แม้ว่าจะหารลงตัวก็ตาม จึงได้ 5.0',
    conceptTip: 'หากต้องการผลหารที่เป็นจำนวนเต็มปัดเศษลง ให้ใช้ตัวดำเนินการ // (Floor Division) เช่น 15 // 3 จะได้ 5'
  },
  {
    id: 7,
    category: 'casting',
    categoryTitle: 'ฟังก์ชันและการรับค่า (Input & Casting)',
    title: 'เมื่อผู้ใช้กรอกตัวเลข 5 ผ่านคำสั่ง x = input("กรอกตัวเลข: ") ตัวแปร x จะมีชนิดข้อมูลใด?',
    codeSnippet: `x = input("กรอกตัวเลข: ")`,
    options: [
      { id: 'a', text: 'int', isCorrect: false },
      { id: 'b', text: 'float', isCorrect: false },
      { id: 'c', text: 'str', isCorrect: true },
      { id: 'd', text: 'bool', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! ฟังก์ชัน input() จะคืนค่าเป็นข้อความ (str) เสมอ ไม่ว่าผู้ใช้จะพิมพ์ตัวเลขหรือข้อความใดๆ',
    conceptTip: 'ถ้าจะนำค่าจาก input() ไปคำนวณ ต้องครอบด้วย int(input()) หรือ float(input()) เสมอ'
  },
  {
    id: 8,
    category: 'operators',
    categoryTitle: 'ตัวดำเนินการกับข้อความ (String Operations)',
    title: 'ผลลัพธ์ของคำสั่ง print("Python" * 2) คือข้อใด?',
    codeSnippet: `print("Python" * 2)`,
    options: [
      { id: 'a', text: 'เกิด TypeError', isCorrect: false },
      { id: 'b', text: 'Python Python', isCorrect: false },
      { id: 'c', text: 'PythonPython', isCorrect: true },
      { id: 'd', text: 'Python2', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! เครื่องหมาย * เมื่อใช้ระหว่างข้อความ (str) กับจำนวนเต็ม (int) จะเป็นการ "ทำซ้ำข้อความ" ติดกันโดยไม่มีช่องว่าง',
    conceptTip: 'str * int = ทำซ้ำข้อความ n ครั้ง เช่น "5" * 3 จะได้ "555"'
  },
  {
    id: 9,
    category: 'naming',
    categoryTitle: 'กฎการตั้งชื่อ (Case Sensitivity)',
    title: 'พิจารณาโค้ดต่อไปนี้ ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?',
    codeSnippet: `Score = 80\nscore = 100\nprint(Score)`,
    options: [
      { id: 'a', text: '100', isCorrect: false },
      { id: 'b', text: '80', isCorrect: true },
      { id: 'c', text: '180', isCorrect: false },
      { id: 'd', text: 'เกิด NameError', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! Python เป็นภาษาที่แยกแยะตัวพิมพ์เล็ก-พิมพ์ใหญ่ (Case-sensitive) ดังนั้น Score และ score จึงเป็นคนละตัวแปรกัน',
    conceptTip: 'ตัวแปร Score มีค่า 80 ส่วน score มีค่า 100 คำสั่ง print(Score) จึงแสดงค่า 80'
  },
  {
    id: 10,
    category: 'casting',
    categoryTitle: 'การแปลงชนิดข้อมูล (Type Conversion)',
    title: 'คำสั่งในข้อใดต่อไปนี้จะทำให้โปรแกรมเกิดข้อผิดพลาด (ValueError)?',
    options: [
      { id: 'a', text: 'int("100")', isCorrect: false },
      { id: 'b', text: 'float("3.14")', isCorrect: false },
      { id: 'c', text: 'str(50)', isCorrect: false },
      { id: 'd', text: 'int("3.14")', isCorrect: true }
    ],
    explanation: 'ถูกต้อง! ฟังก์ชัน int() ไม่สามารถแปลงข้อความทศนิยมตรงๆ ได้ จะเกิด ValueError: invalid literal for int() with base 10: "3.14"',
    conceptTip: 'วิธีที่ถูก: ต้องแปลงเป็น float ก่อน เช่น int(float("3.14")) หรือใช้ float("3.14")'
  }
];

export const POST_TEST_QUESTIONS: Question[] = [
  {
    id: 101,
    category: 'naming',
    categoryTitle: 'กฎการตั้งชื่อ (Naming Rules)',
    title: 'ชื่อตัวแปรในข้อใดต่อไปนี้ถูกต้องตามกฎของภาษา Python ทั้งหมด?',
    options: [
      { id: 'a', text: 'item-cost, 1st_rank', isCorrect: false },
      { id: 'b', text: '_item_cost, rank_1st', isCorrect: true },
      { id: 'c', text: 'total sum, while', isCorrect: false },
      { id: 'd', text: 'price$, def', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! _item_cost ขึ้นต้นด้วย _ ได้ และ rank_1st ตัวเลขไม่ได้อยู่หน้าสุด ส่วนตัวเลือกอื่นมีทั้งเครื่องหมายลบ ช่องว่าง อักขระพิเศษ $ และคำสงวน (while, def)',
    conceptTip: 'จำง่ายๆ: เริ่มด้วย a-z, A-Z หรือ _ เท่านั้น ห้ามเว้นวรรค ห้ามมีเครื่องหมายแปลกๆ ห้ามใช้คำสงวน'
  },
  {
    id: 102,
    category: 'types',
    categoryTitle: 'ชนิดของข้อมูล (Data Types)',
    title: 'เมื่อสั่ง print(type("False")) ในภาษา Python ผลลัพธ์ที่ได้คือข้อใด?',
    codeSnippet: `print(type("False"))`,
    options: [
      { id: 'a', text: "<class 'bool'>", isCorrect: false },
      { id: 'b', text: "<class 'str'>", isCorrect: true },
      { id: 'c', text: "<class 'boolean'>", isCorrect: false },
      { id: 'd', text: "False", isCorrect: false }
    ],
    explanation: 'ถูกต้อง! เพราะคำว่า "False" อยู่ในเครื่องหมายคำพูด จึงมีชนิดข้อมูลเป็นข้อความ (str) ไม่ใช่ bool',
    conceptTip: 'หากต้องการให้เป็น bool ต้องเขียนว่า False โดยไม่มีเครื่องหมายคำพูด'
  },
  {
    id: 103,
    category: 'operators',
    categoryTitle: 'ตัวดำเนินการ (Operators)',
    title: 'ผลลัพธ์ของคำสั่ง print(17 // 5, 17 % 5) คือข้อใด?',
    codeSnippet: `print(17 // 5, 17 % 5)`,
    options: [
      { id: 'a', text: '3.4 2', isCorrect: false },
      { id: 'b', text: '3 2', isCorrect: true },
      { id: 'c', text: '2 3', isCorrect: false },
      { id: 'd', text: '3 3.4', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! 17 // 5 คือการหารปัดเศษลง (Floor Division) ได้ 3 และ 17 % 5 คือการหาเศษที่เหลือจากการหาร (Modulo) ได้ 2',
    conceptTip: '// เอาเฉพาะผลหารที่เป็นจำนวนเต็ม, % เอาเศษที่เหลือ'
  },
  {
    id: 104,
    category: 'casting',
    categoryTitle: 'การแปลงชนิดข้อมูล (Type Casting)',
    title: 'พิจารณาโค้ดต่อไปนี้ ค่าของตัวแปร result คือข้อใด?',
    codeSnippet: `x = 10\ny = "20"\nresult = str(x) + y`,
    options: [
      { id: 'a', text: '30', isCorrect: false },
      { id: 'b', text: '1020', isCorrect: true },
      { id: 'c', text: 'เกิด TypeError', isCorrect: false },
      { id: 'd', text: '"30"', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! str(x) แปลง 10 เป็น "10" เมื่อบวกกับ y ซึ่งเป็น "20" จะเป็นการต่อข้อความ (Concatenation) ได้ "1020"',
    conceptTip: 'str + str = ต่อข้อความเข้าด้วยกัน'
  },
  {
    id: 105,
    category: 'types',
    categoryTitle: 'ชนิดข้อมูลและการคำนวณ (Data Types & Division)',
    title: 'ตัวแปร ans มีชนิดข้อมูลใดหลังจากการคำนวณ?',
    codeSnippet: `ans = 8 / 2\nprint(type(ans))`,
    options: [
      { id: 'a', text: "<class 'int'>", isCorrect: false },
      { id: 'b', text: "<class 'float'>", isCorrect: true },
      { id: 'c', text: "<class 'number'>", isCorrect: false },
      { id: 'd', text: "<class 'double'>", isCorrect: false }
    ],
    explanation: 'ถูกต้อง! เครื่องหมายหาร / ใน Python 3 จะให้ผลลัพธ์เป็น float เสมอ แม้ 8 หาร 2 จะลงตัวเท่ากับ 4.0 ก็ตาม',
    conceptTip: 'ในภาษา Python ไม่มีชนิดข้อมูล double มีเฉพาะ float สำหรับเก็บจำนวนทศนิยม'
  },
  {
    id: 106,
    category: 'casting',
    categoryTitle: 'การรับค่าและแปลงชนิด (input & type casting)',
    title: 'หากต้องการรับตัวเลขอายุจากแป้นพิมพ์แล้วนำไปบวกเพิ่มอีก 1 ปี ข้อใดเขียนได้ถูกต้อง?',
    options: [
      { id: 'a', text: 'age = input("อายุ: ") + 1', isCorrect: false },
      { id: 'b', text: 'age = int(input("อายุ: ")) + 1', isCorrect: true },
      { id: 'c', text: 'age = str(input("อายุ: ")) + 1', isCorrect: false },
      { id: 'd', text: 'age = input(int("อายุ: ")) + 1', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! ฟังก์ชัน input() ให้ค่าเป็นข้อความ จึงต้องครอบด้วย int() ก่อน เพื่อแปลงเป็นจำนวนเต็มจึงจะนำไปบวก 1 ได้',
    conceptTip: 'การเขียน input() + 1 จะเกิด TypeError เพราะไม่สามารถนำ str มาบวกกับ int ได้ตรงๆ'
  },
  {
    id: 107,
    category: 'naming',
    categoryTitle: 'คำสงวนและกฎเกณฑ์ (Keywords & Rules)',
    title: 'ข้อใดอธิบายเกี่ยวกับคำสงวน (Reserved Words) ใน Python ได้ถูกต้องที่สุด?',
    options: [
      { id: 'a', text: 'สามารถนำมาตั้งชื่อตัวแปรได้หากเขียนด้วยตัวพิมพ์ใหญ่ทั้งหมด', isCorrect: false },
      { id: 'b', text: 'เป็นคำที่ตัวแปลภาษา Python จองไว้ ห้ามนำมาตั้งเป็นชื่อตัวแปรหรือฟังก์ชันเด็ดขาด', isCorrect: true },
      { id: 'c', text: 'คำสงวนมีเพียง 3 คำเท่านั้นคือ True, False, None', isCorrect: false },
      { id: 'd', text: 'สามารถใช้เป็นชื่อตัวแปรได้หากมีเครื่องหมาย _ นำหน้า เช่น _for', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! คำสงวนคือคำที่ภาษา Python สงวนไว้ใช้งานเฉพาะ เช่น โครงสร้างเงื่อนไขหรือการวนลูป การนำมาตั้งชื่อตัวแปรตรงๆ จะเกิด SyntaxError ทันที',
    conceptTip: 'Python มีคำสงวนมากกว่า 30 คำ เช่น if, else, for, while, def, class, return, import ฯลฯ'
  },
  {
    id: 108,
    category: 'operators',
    categoryTitle: 'การคูณข้อความ (String Multiplication)',
    title: 'ผลลัพธ์ของโค้ด print("5" * 3 + "0") คือข้อใด?',
    codeSnippet: `print("5" * 3 + "0")`,
    options: [
      { id: 'a', text: '150', isCorrect: false },
      { id: 'b', text: '5550', isCorrect: true },
      { id: 'c', text: '15', isCorrect: false },
      { id: 'd', text: 'เกิด TypeError', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! "5" * 3 ได้ "555" (ข้อความ 5 ทำซ้ำ 3 ครั้ง) จากนั้นนำมาต่อกับ "0" ได้ "5550"',
    conceptTip: 'สังเกตเครื่องหมายคำพูด ถ้ามีเครื่องหมายคำพูดครอบ การคำนวณจะเป็นเรื่องของสตริงทั้งหมด'
  },
  {
    id: 109,
    category: 'types',
    categoryTitle: 'ค่าความจริง (Boolean Evaluation)',
    title: 'ผลลัพธ์ของคำสั่ง print(bool(0), bool(1), bool("")) คือข้อใด?',
    codeSnippet: `print(bool(0), bool(1), bool(""))`,
    options: [
      { id: 'a', text: 'False True False', isCorrect: true },
      { id: 'b', text: 'True False True', isCorrect: false },
      { id: 'c', text: 'False False False', isCorrect: false },
      { id: 'd', text: 'เกิด ValueError', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! ใน Python ค่า 0 และข้อความว่าง ("") จะมีค่าความจริงเป็น False เสมอ ส่วนตัวเลขอื่นๆ ที่ไม่ใช่ 0 จะเป็น True',
    conceptTip: 'ค่าที่เป็น False เมื่อแปลงด้วย bool(): 0, 0.0, "", None, False, [], ()'
  },
  {
    id: 110,
    category: 'casting',
    categoryTitle: 'การแก้ข้อผิดพลาด (Debugging & Type Handling)',
    title: 'พิจารณาโค้ด: score = 95; print("คะแนนของคุณคือ: " + score) เกิดข้อผิดพลาดใดและควรแก้ไขอย่างไร?',
    codeSnippet: `score = 95\nprint("คะแนนของคุณคือ: " + score)`,
    options: [
      { id: 'a', text: 'เกิด SyntaxError แก้โดยเปลี่ยนชื่อตัวแปร score', isCorrect: false },
      { id: 'b', text: 'เกิด TypeError แก้โดยใช้ print("คะแนนของคุณคือ: " + str(score))', isCorrect: true },
      { id: 'c', text: 'เกิด NameError แก้โดยเปลี่ยนเป็น score = "95"', isCorrect: false },
      { id: 'd', text: 'ไม่เกิดข้อผิดพลาด โปรแกรมแสดงผลได้ตามปกติ', isCorrect: false }
    ],
    explanation: 'ถูกต้อง! การนำข้อความ (str) มาต่อกับตัวเลข (int) ด้วยเครื่องหมาย + โดยตรงจะเกิด TypeError: can only concatenate str (not "int") to str จึงต้องแปลง score ด้วย str() ก่อน',
    conceptTip: 'เคล็ดลับ: อีกวิธีที่นิยมใน Python คือ print("คะแนนของคุณคือ:", score) ใช้เครื่องหมายจุลภาคคั่น'
  }
];
