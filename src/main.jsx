import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, Bell, BookOpen, Bot, Building2, Calculator, Check, ChevronDown,
  Clock3, FileText, FlaskConical, GraduationCap, Headphones, Menu, MessageCircle,
  Search, Send, ShieldCheck, Sparkles, UploadCloud, Users, X, Zap, LayoutDashboard,
  ClipboardList, GitBranch, FolderOpen, Brain, HelpCircle, Newspaper, BarChart3,
  Settings, PanelLeftClose, PanelLeftOpen, LogOut, MoreHorizontal, TrendingUp,
  AlertCircle, Plus, Pencil, Trash2, Eye, GripVertical, Save, PlusCircle,
  FileStack, Database, Layers, RefreshCw, ThumbsUp, ThumbsDown, SlidersHorizontal,
  Download, Maximize2
  , Minimize2, Mic, Copy, Flag, History, PlusCircle as NewChatIcon, Mail, Phone,
  LockKeyhole, UserCircle, KeyRound, CheckCircle2
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import './styles.css';

const procedures = [
  { id:'xac-nhan-sinh-vien', title: 'Đăng ký xác nhận sinh viên', code:'TT-DT-001', dept: 'Phòng Đào tạo', time: '1-2 ngày', audience: 'Sinh viên', fee:'Miễn phí', intake:'Trực tuyến 100%', icon: GraduationCap },
  { id:'xac-nhan-cong-tac', title: 'Cấp giấy xác nhận công tác', code:'TT-TCCB-002', dept: 'Phòng Tổ chức Cán bộ', time: '3-5 ngày', audience: 'Cán bộ / Giảng viên', fee:'Miễn phí', intake:'Trực tuyến 100%', icon: Users },
  { id:'cong-tac-phi', title: 'Thanh toán chế độ công tác phí', code:'TT-KHTC-003', dept: 'Phòng Kế hoạch - Tài chính', time: '5-7 ngày', audience: 'Cán bộ / Giảng viên', fee:'Miễn phí', intake:'Trực tuyến 100%', icon: Calculator },
  { id:'nhiem-vu-khcn', title: 'Đề xuất nhiệm vụ khoa học công nghệ', code:'TT-KHCN-004', dept: 'Phòng KHCN & HTPT', time: '7-10 ngày', audience: 'Cán bộ / Giảng viên', fee:'Miễn phí', intake:'Trực tuyến 100%', icon: FlaskConical },
  { id:'su-dung-phong-hoc', title: 'Đăng ký sử dụng phòng học', code:'TT-VP-005', dept: 'Văn phòng', time: '1-3 ngày', audience: 'Tất cả', fee:'Miễn phí', intake:'Trực tuyến 100%', icon: Building2 },
  { id:'cap-lai-the-sinh-vien', title: 'Xin cấp lại thẻ sinh viên', code:'TT-DT-006', dept: 'Phòng Đào tạo', time: '2-3 ngày', audience: 'Sinh viên', fee:'50.000đ', intake:'Trực tuyến 100%', icon: ShieldCheck }
];
const procedureDetails = (procedure) => ({
  ...procedure,
  steps: [
    ['Tiếp nhận hồ sơ', procedure.dept, '01 ngày', 'Cán bộ Một cửa kiểm tra thành phần hồ sơ, ghi nhận mã hồ sơ và gửi thông báo tiếp nhận.', 'Phiếu tiếp nhận hồ sơ'],
    ['Thẩm định', procedure.dept, procedure.time, 'Đơn vị chuyên môn đối chiếu thông tin, kiểm tra tính hợp lệ và yêu cầu bổ sung nếu cần.', 'Phiếu thẩm định'],
    ['Phê duyệt', 'Lãnh đạo đơn vị', '01 ngày', 'Lãnh đạo xem xét kết quả thẩm định và phê duyệt hồ sơ trên hệ thống.', 'Tờ trình phê duyệt'],
    ['Trả kết quả', 'Bộ phận Một cửa', 'Trong ngày', 'Kết quả được ký số và trả trực tuyến; người nộp nhận thông báo qua email.', 'Thông báo kết quả']
  ],
  documents: [
    ['Đơn đề nghị thực hiện thủ tục', '01', '00', 'Ký tên đầy đủ, sử dụng đúng biểu mẫu mới nhất.', true],
    ['Bản sao giấy tờ định danh hoặc thẻ cán bộ/sinh viên', '00', '01', 'Bản sao rõ nét, còn hiệu lực.', false],
    ['Tài liệu chứng minh nội dung đề nghị', '00', '01', 'Bổ sung theo yêu cầu cụ thể của đơn vị chuyên môn.', false]
  ],
  forms: [
    ['Đơn đề nghị thực hiện thủ tục', 'DOCX', '186 KB'],
    ['Phiếu tiếp nhận và hẹn trả kết quả', 'PDF', '420 KB']
  ],
  legal: ['Quy chế tổ chức và hoạt động của Trường Đại học Thái Bình năm 2026', 'Quy định tiếp nhận và giải quyết thủ tục hành chính tại Bộ phận Một cửa', 'Quyết định số 128/QĐ-ĐHTB ngày 05/01/2026 về cung cấp dịch vụ công trực tuyến'],
  faqs: [['Thời gian xử lý có tính ngày nghỉ không?', 'Thời hạn được tính theo ngày làm việc, không bao gồm thứ Bảy, Chủ nhật và ngày lễ.'], ['Tôi có thể bổ sung hồ sơ sau khi đã nộp không?', 'Có. Hệ thống sẽ gửi yêu cầu bổ sung và hướng dẫn chi tiết nếu hồ sơ chưa đầy đủ.'], ['Làm sao để theo dõi kết quả?', 'Bạn dùng mã hồ sơ trong email xác nhận để tra cứu trên mục Tra cứu hồ sơ.']]
});

const news = [
  { date: '08/10/2026', title: 'Triển khai cổng dịch vụ hành chính trực tuyến phiên bản mới', text: 'Sinh viên và cán bộ có thể nộp hồ sơ, theo dõi tiến độ và nhận kết quả mọi lúc.' },
  { date: '02/10/2026', title: 'Hướng dẫn cập nhật thông tin tài khoản người dùng', text: 'Một số lưu ý để bảo mật tài khoản và nhận thông báo xử lý hồ sơ kịp thời.' },
  { date: '25/09/2026', title: 'Lịch tiếp nhận hồ sơ trực tiếp tại Bộ phận Một cửa', text: 'Thời gian làm việc từ thứ Hai đến thứ Sáu, sáng 7h30-11h30 và chiều 13h30-17h.' }
];

const demoUsers = {
  student: { id: 'sv-2100123', name: 'Nguyễn Lan Anh', email: 'lananh@tbu.edu.vn', code: '21D100123', role: 'student', avatar: 'LA', phone: '0988 123 456', department: 'Khoa Kinh tế' },
  staff: { id: 'cb-001', name: 'Trần Thu Hà', email: 'thuha@tbu.edu.vn', code: 'CBGV001', role: 'staff', avatar: 'TH', phone: '0912 345 678', department: 'Bộ phận Một cửa' },
  admin: { id: 'ad-001', name: 'Quản trị viên', email: 'admin@tbu.edu.vn', code: 'ADMIN001', role: 'admin', avatar: 'AD', phone: '0901 234 567', department: 'Phòng Công nghệ thông tin' }
};
const roleLabel = (role) => ({ student: 'Sinh viên', staff: 'Cán bộ xử lý', admin: 'Quản trị viên' }[role] || 'Khách');
const initials = (name = '') => name.split(' ').filter(Boolean).slice(-2).map(item => item[0]).join('').toUpperCase();
const DataStoreContext = createContext(null);
const publicProcedure = item => ({ ...item, id: item.id || item.code?.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title: item.title || item.name, name: item.name || item.title, code: item.code || `TT-${String(item.id || '').slice(0, 5).toUpperCase()}`, dept: item.dept || item.department, time: item.time || '3-5 ngày', audience: item.audience || 'Tất cả', fee: item.fee || 'Miễn phí', intake: item.intake || 'Trực tuyến 100%', icon: item.icon || FileText });
function DataStoreProvider({ children }) {
  const [storeProcedures, setStoreProcedures] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('tbu-procedures')); return saved?.length ? saved : procedureManagementSeed.map(publicProcedure); } catch { return procedureManagementSeed.map(publicProcedure); }
  });
  const [storeForms, setStoreForms] = useState(() => { try { const saved = JSON.parse(localStorage.getItem('tbu-forms')); return saved?.length ? saved : formSeed; } catch { return formSeed; } });
  const [storeApplications, setStoreApplications] = useState(() => { try { const saved = JSON.parse(localStorage.getItem('tbu-applications')); return saved?.length ? saved : applicationSeed; } catch { return applicationSeed; } });
  const [knowledgeBase, setKnowledgeBase] = useState(() => { try { const saved = JSON.parse(localStorage.getItem('tbu-knowledge-base')); return saved?.length ? saved : knowledgeSeed; } catch { return knowledgeSeed; } });
  const [notifications, setNotifications] = useState(() => { try { return JSON.parse(localStorage.getItem('tbu-notifications')) || []; } catch { return []; } });
  const [institution, setInstitution] = useState(() => { try { return JSON.parse(localStorage.getItem('tbu-institution')) || { unitName: 'Trường Đại học Thái Bình', departmentName: 'Bộ phận Tiếp nhận và Trả kết quả (Một cửa)', address: 'Phố Lê Thánh Tông, Phường Trần Hưng Đạo, TP. Thái Bình', hotline: '(0227) 3831 499 - 0988 xxx xxx', email: 'motcua@tbu.edu.vn', workingHours: 'Thứ 2 - Thứ 6 (Sáng 7h30-11h30, Chiều 13h30-17h00)' }; } catch { return { unitName: 'Trường Đại học Thái Bình', departmentName: 'Bộ phận Tiếp nhận và Trả kết quả (Một cửa)', address: 'Phố Lê Thánh Tông, Phường Trần Hưng Đạo, TP. Thái Bình', hotline: '(0227) 3831 499 - 0988 xxx xxx', email: 'motcua@tbu.edu.vn', workingHours: 'Thứ 2 - Thứ 6 (Sáng 7h30-11h30, Chiều 13h30-17h00)' }; } });
  useEffect(() => localStorage.setItem('tbu-procedures', JSON.stringify(storeProcedures)), [storeProcedures]);
  useEffect(() => localStorage.setItem('tbu-forms', JSON.stringify(storeForms)), [storeForms]);
  useEffect(() => localStorage.setItem('tbu-applications', JSON.stringify(storeApplications)), [storeApplications]);
  useEffect(() => localStorage.setItem('tbu-knowledge-base', JSON.stringify(knowledgeBase)), [knowledgeBase]);
  useEffect(() => localStorage.setItem('tbu-notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('tbu-institution', JSON.stringify(institution)), [institution]);
  const addNotification = notification => setNotifications(items => [{ id: Date.now(), createdAt: new Date().toISOString(), ...notification }, ...items].slice(0, 30));
  const markNotificationsRead = () => setNotifications(items => items.map(item => ({ ...item, read: true })));
  const resetData = () => { setStoreProcedures(procedureManagementSeed.map(publicProcedure)); setStoreForms(formSeed); setStoreApplications(applicationSeed); setKnowledgeBase(knowledgeSeed); setNotifications([]); };
  return <DataStoreContext.Provider value={{ procedures: storeProcedures, forms: storeForms, applications: storeApplications, knowledgeBase, notifications, institution, setInstitution, setProcedures: setStoreProcedures, setForms: setStoreForms, setApplications: setStoreApplications, setKnowledgeBase, addNotification, markNotificationsRead, resetData }}>{children}</DataStoreContext.Provider>;
}
const useDataStore = () => useContext(DataStoreContext);
const downloadCsv = (filename, rows) => {
  const escape = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + rows.map(row => row.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
const applicationCsvRows = applications => [
  ['Mã hồ sơ', 'Người nộp', 'Thủ tục', 'Phòng ban', 'Ngày nộp', 'Trạng thái', 'Cán bộ xử lý'],
  ...applications.map(item => [item.code, item.applicant, item.procedure, item.dept, item.date, item.status, item.staff])
];
const GEMINI_MODEL = 'gemini-1.5-flash';
const getGeminiKey = () => localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
const getAiSettings = () => { try { return JSON.parse(localStorage.getItem('tbu-ai-settings')) || {}; } catch { return {}; } };
const buildRagContext = ({ procedures = [], forms = [], knowledgeBase = [], applications = [] }) => ({
  procedures: procedures.map(item => {
    const procedure = publicProcedure(item);
    return { id: procedure.id, code: procedure.code, name: procedure.title, department: procedure.dept, audience: procedure.audience, processingTime: procedure.time, fee: procedure.fee, intake: procedure.intake, steps: procedure.steps || item.steps };
  }),
  forms: forms.map(item => ({ code: item.code, name: item.name, category: item.category, department: item.dept, format: item.type, size: item.size })),
  knowledgeBase: knowledgeBase.map(item => ({ name: item.name, category: item.category, type: item.type, status: item.status, chunks: item.chunks })),
  applications: applications.slice(0, 20).map(item => ({ code: item.code, status: item.status, procedure: item.procedure, submittedAt: item.submittedAt || item.date }))
});
const offlineAssistantResponse = (question, context) => {
  const lower = question.toLowerCase();
  const procedure = context.procedures.find(item => lower.includes(item.name.toLowerCase()) || (lower.includes('nghỉ') && item.name.toLowerCase().includes('nghỉ')) || (lower.includes('lương') && item.name.toLowerCase().includes('lương')));
  const form = context.forms.find(item => lower.includes('tải') || lower.includes('mẫu') || lower.includes('đơn'));
  if ((lower.includes('hồ sơ') || /hs-\d{4}-\d{4,6}/i.test(question)) && /hs-\d{4}-\d{4,6}/i.test(question)) {
    const code = question.match(/hs-\d{4}-\d{4,6}/i)[0].toUpperCase();
    const application = context.applications.find(item => item.code === code);
    return { from: 'bot', type: 'text', text: application ? `Hồ sơ ${code} đang ở trạng thái **${application.status}**. Thủ tục: ${application.procedure}. Bạn có thể xem timeline đầy đủ tại mục Tra cứu hồ sơ.` : `Mình chưa tìm thấy hồ sơ ${code}. Bạn hãy kiểm tra lại mã HS-2026-XXXX nhé.` };
  }
  if (procedure) return { from: 'bot', type: 'procedure', text: `Dưới đây là thông tin mình tìm thấy trong cơ sở dữ liệu Một cửa:`, procedure: procedure.name, dept: procedure.department, time: procedure.processingTime };
  if (form) return { from: 'bot', type: 'form', text: `Bạn có thể tìm và tải biểu mẫu phù hợp trong kho biểu mẫu của trường.`, form: form.name, size: form.size || 'Theo tài liệu', format: form.format || 'PDF' };
  if (lower.includes('nộp') || lower.includes('quy trình') || lower.includes('làm sao')) return { from: 'bot', type: 'guide', text: 'Bạn có thể thực hiện theo quy trình chung sau:', steps: [['Chọn thủ tục', 'Mở danh mục Thủ tục hành chính và xem yêu cầu hồ sơ.'], ['Nộp trực tuyến', 'Đăng nhập, điền thông tin và tải các tệp theo hướng dẫn.'], ['Theo dõi kết quả', 'Lưu mã hồ sơ HS-2026-XXXX để tra cứu tiến độ.']] };
  return { from: 'bot', type: 'text', text: 'Mình chưa tìm thấy câu trả lời chính xác trong dữ liệu hiện có. Bạn có thể hỏi về thủ tục, biểu mẫu, quy trình hoặc mã hồ sơ cụ thể để mình tra cứu tốt hơn.' };
};
const askGemini = async (question, context, apiKey, settings = {}) => {
  const model = settings.model || GEMINI_MODEL;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt = `${settings.systemPrompt || 'Bạn là Trợ lý AI của Bộ phận Một cửa Trường Đại học Thái Bình. Hãy trả lời bằng tiếng Việt, rõ ràng, thân thiện và chỉ sử dụng dữ liệu trong CONTEXT khi nói về thủ tục, biểu mẫu, hồ sơ. Nếu không đủ dữ liệu, nói rõ cần liên hệ cán bộ, không bịa thông tin. Có thể dùng Markdown đơn giản.'}\n\nCONTEXT:\n${JSON.stringify(context)}\n\nCÂU HỎI:\n${question}`;
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: Number(settings.temperature ?? 0.3), maxOutputTokens: 700 } }) });
  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!text) throw new Error('Gemini returned an empty response');
  return { from: 'bot', type: 'text', text, source: 'gemini' };
};

function MarkdownText({ text = '', navigate }) {
  const lines = text.split(/\r?\n/);
  const renderInline = (value, keyPrefix = '') => {
    const parts = value.split(/(\[[^\]]+\]\((?:\/[^)\s]+|https?:\/\/[^)\s]+)\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
    return parts.map((part, index) => {
      const key = `${keyPrefix}-${index}`;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        return <a key={key} href={href} onClick={event => { if (href.startsWith('/')) { event.preventDefault(); navigate?.(href.slice(1)); } }} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{label}</a>;
      }
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={key}>{part.slice(1, -1)}</em>;
      if (part.startsWith('`') && part.endsWith('`')) return <code key={key}>{part.slice(1, -1)}</code>;
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
  };
  const blocks = [];
  let tableRows = [];
  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.filter(row => !row.every(cell => /^:?-{3,}:?$/.test(cell.trim()))).map(row => row.map(cell => cell.trim()));
    if (rows.length) blocks.push(<table className="chat-markdown-table" key={`table-${blocks.length}`}><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => rowIndex === 0 ? <th key={cellIndex}>{renderInline(cell, `${rowIndex}-${cellIndex}`)}</th> : <td key={cellIndex}>{renderInline(cell, `${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody></table>);
    tableRows = [];
  };
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableRows.push(trimmed.slice(1, -1).split('|'));
      return;
    }
    flushTable();
    if (!trimmed) { blocks.push(<div className="chat-markdown-spacer" key={`space-${index}`} />); return; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { blocks.push(React.createElement(`h${heading[1].length + 2}`, { key: `heading-${index}` }, renderInline(heading[2], `heading-${index}`))); return; }
    if (/^[-*]\s+/.test(trimmed)) { blocks.push(<li className="chat-markdown-bullet" key={`bullet-${index}`}>{renderInline(trimmed.replace(/^[-*]\s+/, ''), `bullet-${index}`)}</li>); return; }
    if (/^\d+\.\s+/.test(trimmed)) { blocks.push(<li className="chat-markdown-number" key={`number-${index}`}>{renderInline(trimmed.replace(/^\d+\.\s+/, ''), `number-${index}`)}</li>); return; }
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(trimmed, `paragraph-${index}`)}</p>);
  });
  flushTable();
  return <div className="chat-markdown">{blocks}</div>;
}

function ChatMessage({ message, index, onContext, onSend, navigate }) {
  return <div className={message.from === 'user' ? 'message user' : 'message'} onContextMenu={onContext} style={{animationDelay:`${Math.min(index * 50, 250)}ms`}}>
    <div className="message-bubble"><MarkdownText text={message.text} navigate={navigate} /></div>
    {message.type === 'guide' && <div className="guide-card">{message.steps.map((step,i)=><details key={step[0]} open={i===0}><summary><span>{i+1}</span><b>{step[0]}</b></summary><p>{step[1]}</p></details>)}{message.form && <FormChatCard name={message.form} size="186 KB" format="DOC" />}</div>}
    {message.type === 'procedure' && <div className="procedure-chat-card"><div className="chat-card-label">THỦ TỤC ĐỀ XUẤT</div><b>{message.procedure}</b><span className="chat-dept">{message.dept}</span><small>Thời gian xử lý: {message.time}</small><p>Hướng dẫn chi tiết các bước thực hiện và hồ sơ cần chuẩn bị.</p><div><button onClick={()=>onSend('Xem chi tiết thủ tục')}>Xem chi tiết</button><button onClick={()=>onSend('Nộp hồ sơ online')}>Nộp hồ sơ</button></div></div>}
    {message.type === 'form' && <FormChatCard name={message.form} size={message.size} format={message.format}/>}
    {message.type === 'status' && <div className="status-chat-card">{['Đã tiếp nhận','Đang xử lý','Hoàn thành','Trả kết quả'].map((x,i)=><div className={i<2?'done':''} key={x}><i>{i<2?<Check size={10}/>:i+1}</i><span>{x}<small>{i<2?'08/10/2026 · 10:05':'Đang chờ xử lý'}</small></span></div>)}</div>}
    {message.from === 'bot' && <span className="feedback">♧ Hữu ích &nbsp; • &nbsp; Không</span>}
  </div>;
}
function FormChatCard({name,size='186 KB',format='DOC'}) { return <div className="form-chat-card"><span className="form-chat-icon"><FileText size={18}/></span><span><b>{name}</b><small>{format} · {size}</small></span><button>Tải về <Download size={14}/></button></div>; }
function ChatEmpty({onSelect}) { return <div className="chat-empty"><span className="empty-bot"><Bot size={32}/></span><h3>Tôi có thể giúp gì cho bạn?</h3><p>Tra cứu thủ tục, hướng dẫn nộp hồ sơ và tải biểu mẫu.</p><div>{['Thủ tục xin nghỉ phép cần gì?','Làm sao để nộp hồ sơ online?','Quy trình nâng lương trước hạn?','Tải đơn xin chuyển công tác'].map(x=><button key={x} onClick={()=>onSelect(x)}>{x}</button>)}</div></div>; }

function App() {
  const dataStore = useDataStore();
  const { institution } = dataStore;
  const pageFromPath = () => {
    const path = window.location.pathname.replace(/^\/+/, '');
    if (path === 'admin/procedures') return 'admin-procedures';
    if (path === 'admin/forms') return 'admin-forms';
    if (path === 'admin/processes') return 'admin-processes';
    if (path === 'admin/applications') return 'admin-applications';
    if (path === 'admin/knowledge-base') return 'admin-knowledge-base';
    if (path === 'admin/users') return 'admin-users';
    if (path === 'admin/faq') return 'admin-faq';
    if (path === 'admin/news') return 'admin-news';
    if (path === 'admin/reports') return 'admin-reports';
    if (path === 'admin/settings') return 'admin-settings';
    if (path.startsWith('admin/')) return 'admin-guard';
    if (path === 'login') return 'login';
    if (path === 'register') return 'register';
    if (path === 'forgot-password') return 'forgot-password';
    if (path.startsWith('procedures/')) return `procedure-detail:${path.slice('procedures/'.length)}`;
    return path === 'admin' ? 'admin' : (['procedures', 'forms', 'apply', 'track', 'news', 'profile'].includes(path) ? path : path ? 'not-found' : 'home');
  };
  const [page, setPage] = useState(pageFromPath);
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) || null; } catch { return null; }
  });
  const [authNotice, setAuthNotice] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFull, setChatFull] = useState(false);
  const [chatHistory, setChatHistory] = useState(false);
  const [typing, setTyping] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tbu-theme') === 'dark');
  const [toast, setToast] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [geminiKey, setGeminiKey] = useState(getGeminiKey);
  const [keyDraft, setKeyDraft] = useState(getGeminiKey);
  const [keySettingsOpen, setKeySettingsOpen] = useState(false);
  const [aiSource, setAiSource] = useState('');
  const [listening, setListening] = useState(false);
  const speechRecognitionRef = useRef(null);
  const [messages, setMessages] = useState([
    { from: 'user', text: 'Tôi muốn xin nghỉ phép, cần làm gì?' },
    { from: 'bot', type: 'guide', text: 'Bạn cần chuẩn bị hồ sơ và gửi qua cổng trực tuyến. Đây là hướng dẫn nhanh:', steps: [
      ['Chuẩn bị hồ sơ', 'Điền Đơn xin nghỉ phép năm và các giấy tờ liên quan.'],
      ['Nộp hồ sơ online', 'Đăng nhập, chọn thủ tục và tải tài liệu lên hệ thống.'],
      ['Theo dõi kết quả', 'Tra cứu bằng mã hồ sơ trong suốt quá trình xử lý.']
    ], form: 'Đơn xin nghỉ phép năm.doc' },
    { from: 'user', text: 'Thời gian xử lý bao lâu?' },
    { from: 'bot', type: 'procedure', text: 'Thời gian xử lý dự kiến là 3-5 ngày làm việc.', procedure: 'Đăng ký nghỉ phép năm', dept: 'Phòng Tổ chức Cán bộ', time: '3-5 ngày' },
    { from: 'user', text: 'Tải đơn cho tôi' },
    { from: 'bot', type: 'form', text: 'Đây là biểu mẫu bạn cần:', form: 'Đơn xin nghỉ phép năm.doc', size: '186 KB', format: 'DOC' }
  ]);

  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  useEffect(() => {
    const protectedPath = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
    if (protectedPath && !['admin', 'staff'].includes(currentUser?.role)) {
      setAuthNotice('Bạn cần đăng nhập bằng tài khoản quản trị');
      setPage('login');
      window.history.replaceState({}, '', '/login');
    }
  }, [currentUser]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('tbu-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const navigate = (next) => {
    const routeName = next.split('?')[0];
    setPage(routeName);
    window.history.pushState({}, '', next === 'home' ? '/' : `/${next}`);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const login = (user, message = '') => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setAuthNotice(message);
    if (message) {
      setToast({ type: 'success', text: message });
      window.setTimeout(() => setToast(null), 3000);
    }
    navigate(user.role === 'admin' || user.role === 'staff' ? 'admin' : 'home');
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setProfileOpen(false);
    setToast({ type: 'success', text: '✅ Bạn đã đăng xuất thành công' });
    navigate('home');
    window.setTimeout(() => setToast(null), 2600);
  };
  const sendMessage = async (text = chatInput) => {
    if (!text.trim()) return;
    setMessages((current) => [...current, { from: 'user', text }]);
    setChatInput('');
    setToast({ type: 'info', text: 'ℹ️ Đang tìm thông tin phù hợp cho bạn...' });
    setTyping(true);
    const context = buildRagContext(dataStore);
    let response;
    try {
      response = geminiKey ? await askGemini(text, context, geminiKey, getAiSettings()) : offlineAssistantResponse(text, context);
      setAiSource(response.source === 'gemini' ? 'Gemini' : 'Offline');
      setMessages(current => [...current, response]);
      setToast({ type: 'success', text: response.source === 'gemini' ? '✅ Gemini đã trả lời dựa trên dữ liệu Một cửa' : '✅ Trợ lý offline đã trả lời từ dữ liệu nội bộ' });
    } catch (error) {
      console.warn('Gemini unavailable; using offline assistant.', error);
      response = offlineAssistantResponse(text, context);
      setAiSource('Offline fallback');
      setMessages(current => [...current, { ...response, text: `${response.text}\n\n_(Gemini hiện không khả dụng, câu trả lời này dùng dữ liệu offline của hệ thống.)_` }]);
      setToast({ type: 'warning', text: '⚠️ Gemini không khả dụng, đã chuyển sang chế độ offline' });
    } finally {
      setTyping(false);
      window.setTimeout(() => setToast(null), 3000);
    }
  };
  const saveGeminiKey = () => {
    const value = keyDraft.trim();
    if (value) {
      localStorage.setItem('gemini_api_key', value);
      setGeminiKey(value);
      setToast({ type: 'success', text: '✅ Đã lưu Gemini API Key trên thiết bị này' });
    } else {
      localStorage.removeItem('gemini_api_key');
      setGeminiKey('');
      setToast({ type: 'info', text: 'ℹ️ Đã xóa API Key, chatbot sẽ dùng chế độ offline' });
    }
    setKeySettingsOpen(false);
    window.setTimeout(() => setToast(null), 2600);
  };
  const toggleVoiceInput = () => {
    if (listening) {
      speechRecognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast({ type: 'warning', text: '⚠️ Trình duyệt này chưa hỗ trợ nhập giọng nói tiếng Việt' });
      window.setTimeout(() => setToast(null), 3000);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setListening(true);
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0]?.transcript || '').join('');
      setChatInput(transcript);
    };
    recognition.onerror = event => {
      setListening(false);
      if (event.error !== 'aborted') {
        setToast({ type: 'error', text: '❌ Không thể nhận dạng giọng nói, vui lòng thử lại' });
        window.setTimeout(() => setToast(null), 3000);
      }
    };
    recognition.onend = () => {
      setListening(false);
      speechRecognitionRef.current = null;
    };
    speechRecognitionRef.current = recognition;
    recognition.start();
  };
  const askProcedure = (procedure) => {
    const question = `Hãy hướng dẫn tôi chi tiết thủ tục ${procedure.title} và những lưu ý quan trọng!`;
    setChatOpen(true);
    window.setTimeout(() => sendMessage(question), 0);
  };

  return (
    <div className="app">
      {page === 'admin' && <AdminPanel />}
      {page === 'admin-procedures' && <AdminProcedures />}
      {page === 'admin-forms' && <AdminForms />}
      {page === 'admin-processes' && <AdminProcesses />}
      {page === 'admin-applications' && <AdminApplications />}
      {page === 'admin-knowledge-base' && <AdminKnowledgeBase />}
      {page === 'admin-users' && <AdminUsers />}
      {page === 'admin-faq' && <AdminFaq />}
      {page === 'admin-news' && <AdminNews />}
      {page === 'admin-reports' && <AdminReports />}
      {page === 'admin-settings' && <AdminSettings />}
      {page === 'login' && <Login onLogin={login} notice={authNotice} navigate={navigate} />}
      {page === 'register' && <Register onLogin={login} navigate={navigate} />}
      {page === 'forgot-password' && <ForgotPassword navigate={navigate} />}
      {page === 'admin-guard' && null}
      {page !== 'admin' && page !== 'admin-procedures' && page !== 'admin-forms' && page !== 'admin-processes' && page !== 'admin-applications' && page !== 'admin-knowledge-base' && page !== 'admin-users' && page !== 'admin-faq' && page !== 'admin-news' && page !== 'admin-reports' && page !== 'admin-settings' && !['login','register','forgot-password','admin-guard'].includes(page) && <>
      <header className="header">
        <div className="header-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label="Về trang chủ">
            <span className="brand-mark"><Building2 size={22} /></span>
            <span><strong>TRƯỜNG ĐẠI HỌC THÁI BÌNH</strong><small>Bộ phận Một cửa</small></span>
          </button>
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
          <nav className={mobileOpen ? 'nav open' : 'nav'}>
            <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Trang chủ</button>
            <button className={page === 'procedures' ? 'active' : ''} onClick={() => navigate('procedures')}>Thủ tục hành chính</button>
            <button onClick={() => navigate('forms')}>Biểu mẫu</button>
            <button className={page === 'apply' ? 'active' : ''} onClick={() => navigate('apply')}>Nộp hồ sơ</button>
            <button className={page === 'track' ? 'active' : ''} onClick={() => navigate('track')}>Tra cứu</button>
            <button onClick={() => navigate('news')}>Tin tức</button>
          </nav>
          <div className="header-actions">
            <button className="icon-button" aria-label="Tìm kiếm"><Search size={19} /></button>
            <button className="icon-button" aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} onClick={() => setDarkMode(value => !value)}>{darkMode ? '☀' : '◐'}</button>
            <NotificationButton audience={currentUser?.email || currentUser?.role || 'guest'} />
            {currentUser ? <div className="profile-wrap"><button className="profile-button" onClick={() => setProfileOpen(value => !value)}><span className="avatar">{currentUser.avatar || initials(currentUser.name)}</span><span className="profile-name">{currentUser.name}</span><ChevronDown size={15} /></button>{profileOpen && <div className="profile-menu"><div className="profile-menu-head"><b>{currentUser.name}</b><small>{roleLabel(currentUser.role)}</small></div><button onClick={() => { setProfileOpen(false); navigate('profile'); }}><UserCircle size={16}/> Hồ sơ cá nhân</button><button onClick={() => { setProfileOpen(false); navigate('track'); }}><FolderOpen size={16}/> Hồ sơ của tôi</button>{['admin','staff'].includes(currentUser.role) && <button onClick={() => { setProfileOpen(false); navigate('admin'); }}><LayoutDashboard size={16}/> Trang quản trị Admin</button>}<button className="profile-logout" onClick={logout}><LogOut size={16}/> Đăng xuất</button></div>}</div> : <><button className="auth-link" onClick={() => navigate('login')}>Đăng nhập</button><button className="auth-register" onClick={() => navigate('register')}>Đăng ký</button></>}
          </div>
        </div>
      </header>

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'procedures' && <Procedures navigate={navigate} />}
        {page === 'forms' && <Forms />}
        {page === 'apply' && <Apply navigate={navigate} currentUser={currentUser} />}
        {page === 'track' && <Track currentUser={currentUser} />}
        {page === 'news' && <News />}
        {page === 'profile' && <Profile />}
        {page.startsWith('procedure-detail:') && <ProcedureDetail procedure={procedureDetails(dataStore.procedures.find(item => item.id === page.split(':')[1]) || dataStore.procedures[0] || procedures[0])} navigate={navigate} onAsk={askProcedure} />}
        {page === 'not-found' && <NotFound navigate={navigate} />}
      </motion.main>

      <footer className="footer">
        <div className="footer-grid">
          <div><div className="footer-brand"><span className="brand-mark"><Building2 size={20} /></span><strong>ĐẠI HỌC THÁI BÌNH</strong></div><p>Cổng dịch vụ hành chính trực tuyến<br />nhanh chóng, minh bạch và hiệu quả.</p></div>
          <div><h4>Liên kết nhanh</h4><button onClick={() => navigate('procedures')}>Thủ tục hành chính</button><button onClick={() => navigate('forms')}>Tải biểu mẫu</button><button onClick={() => navigate('track')}>Tra cứu hồ sơ</button></div>
          <div><h4>Liên hệ</h4><p>{institution.address}</p><p>{institution.hotline}</p><p>{institution.email}</p></div>
          <div><h4>Thời gian làm việc</h4><p>{institution.workingHours}</p><div className="online"><span /> Đang trực tuyến</div></div>
        </div>
        <div className="copyright">© 2026 Trường Đại học Thái Bình. All rights reserved.</div>
      </footer>

      <div className={chatOpen ? `chat-panel visible ${chatFull ? 'full' : ''}` : 'chat-panel'}>
        <div className="chat-head"><div><button className="history-toggle" onClick={() => setChatHistory(!chatHistory)} aria-label="Lịch sử trò chuyện"><History size={18}/></button><span className="bot-avatar"><Bot size={20} /></span><span><strong>Trợ lý AI Một cửa</strong><small><i /> {aiSource || (geminiKey ? 'Gemini sẵn sàng' : 'Offline sẵn sàng')}</small></span></div><div className="chat-head-actions"><button title="Cài đặt Gemini API Key" onClick={() => { setKeyDraft(geminiKey); setKeySettingsOpen(true); }}><Settings size={16}/></button><button title={chatFull ? 'Thu nhỏ' : 'Toàn màn hình'} onClick={() => setChatFull(!chatFull)}>{chatFull ? <Minimize2 size={17}/> : <Maximize2 size={17}/>}</button><button onClick={() => setChatOpen(false)}><X size={18} /></button></div></div>
        <div className="chat-body-wrap">{chatHistory && <aside className="chat-history"><button className="new-chat" onClick={() => setMessages([])}><NewChatIcon size={15}/> Cuộc trò chuyện mới</button><small>LỊCH SỬ GẦN ĐÂY</small>{['Tôi muốn xin nghỉ phép...','Hướng dẫn nộp hồ sơ online','Tra cứu hồ sơ HS-2026'].map((item,index)=><button className="history-item" key={item}><MessageCircle size={14}/><span>{item}<small>{index===0?'Hôm nay':'Hôm qua'}</small></span></button>)}</aside>}<div className="chat-content"><div className="chat-messages">{messages.length === 0 ? <ChatEmpty onSelect={sendMessage}/> : messages.map((message, index) => <ChatMessage key={index} message={message} index={index} navigate={navigate} onContext={(event) => {event.preventDefault();setContextMenu({x:event.clientX,y:event.clientY,index})}} onSend={sendMessage}/>) }{typing && <div className="typing-indicator"><span/><span/><span/><b>Trợ lý AI đang suy nghĩ...</b></div>}</div><div className="suggestions">{['Thủ tục xin nghỉ phép cần gì?','Làm sao để nộp hồ sơ online?','Quy trình nâng lương trước hạn?','Tải đơn xin chuyển công tác'].map(item=><button key={item} onClick={()=>sendMessage(item)}>{item}</button>)}</div><div className="chat-input"><button aria-label="Đính kèm"><UploadCloud size={18}/></button><button className={listening ? 'voice-button listening' : 'voice-button'} title={listening ? 'Dừng ghi âm' : 'Nhập bằng giọng nói tiếng Việt'} aria-label={listening ? 'Dừng ghi âm' : 'Nhập bằng giọng nói tiếng Việt'} onClick={toggleVoiceInput}><Mic size={17}/><span /></button><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder={listening ? 'Đang nghe tiếng Việt...' : 'Nhập câu hỏi của bạn...'} /><button className="send" onClick={() => sendMessage()}><Send size={17} /></button></div></div></div>
        {contextMenu && <div className="chat-context-menu" style={{left:contextMenu.x,top:contextMenu.y}}><button onClick={() => {navigator.clipboard?.writeText(messages[contextMenu.index]?.text || '');setContextMenu(null)}}><Copy size={14}/> Sao chép</button><button onClick={() => setContextMenu(null)}><Flag size={14}/> Báo lỗi nội dung</button></div>}
        {keySettingsOpen && <div className="chat-key-backdrop" role="dialog" aria-modal="true" aria-label="Cài đặt Gemini API Key"><div className="chat-key-dialog"><div className="chat-key-title"><div><h3>Kết nối Google Gemini</h3><p>API Key chỉ được lưu trong LocalStorage của trình duyệt này.</p></div><button onClick={() => setKeySettingsOpen(false)} aria-label="Đóng"><X size={17}/></button></div><label>Gemini API Key<input type="password" value={keyDraft} onChange={event => setKeyDraft(event.target.value)} placeholder="AIza..." autoFocus /></label><small className="chat-key-help">Không có key hoặc gọi API lỗi thì chatbot tự động dùng dữ liệu offline của Bộ phận Một cửa.</small><div className="chat-key-actions"><button className="outline-btn" onClick={() => { setKeyDraft(''); saveGeminiKey(); }}>Dùng offline</button><button className="primary-btn" onClick={saveGeminiKey}>Lưu API Key</button></div></div></div>}
      </div>
      {!chatOpen && <button className="chat-fab" onClick={() => setChatOpen(true)} aria-label="Mở trợ lý AI"><Bot size={26} /><span /></button>}
      <AnimatePresence>{toast && <motion.div className={`toast toast-${toast.type}`} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} role="status">{toast.text}<button aria-label="Đóng thông báo" onClick={() => setToast(null)}><X size={14}/></button></motion.div>}</AnimatePresence>
      </>}
    </div>
  );
}

function NotFound({ navigate }) {
  return <section className="not-found" role="status"><span className="not-found-icon"><Building2 size={42}/></span><strong>404</strong><h1>Không tìm thấy trang</h1><p>Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác.</p><button className="primary-btn" onClick={() => navigate('home')}>Về trang chủ</button></section>;
}

function AuthShell({ children, title, subtitle }) {
  return <div className="auth-page"><div className="auth-visual"><div className="auth-visual-overlay"><span className="brand-mark"><Building2 size={26}/></span><b>TRƯỜNG ĐẠI HỌC THÁI BÌNH</b><h1>Bộ phận Một cửa<br/>số hóa</h1><p>Minh bạch · Nhanh chóng · Hiệu quả</p></div></div><section className="auth-panel"><button className="auth-brand" onClick={() => window.history.back()}><span className="brand-mark"><Building2 size={20}/></span><span><b>ĐẠI HỌC THÁI BÌNH</b><small>Cổng dịch vụ hành chính</small></span></button><div className="auth-content"><div className="auth-heading"><h2>{title}</h2><p>{subtitle}</p></div>{children}</div></section></div>;
}

function Login({ onLogin, navigate, notice }) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(notice || '');
  const submit = (event) => {
    event.preventDefault();
    if (!identity.trim() || !password) return setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
    if (identity.includes('@') && !/^[^@\s]+@tbu\.edu\.vn$/i.test(identity)) return setError('Vui lòng sử dụng email trường có đuôi @tbu.edu.vn.');
    const user = Object.values(demoUsers).find(item => item.email.toLowerCase() === identity.toLowerCase() || item.code.toLowerCase() === identity.toLowerCase());
    if (!user || password !== '123456') return setError('Thông tin đăng nhập không chính xác. Tài khoản demo dùng mật khẩu 123456.');
    onLogin(user);
  };
  const demo = (key) => { const user = demoUsers[key]; setIdentity(user.email); setPassword('123456'); onLogin(user); };
  return <AuthShell title="Đăng nhập" subtitle="Đăng nhập để sử dụng đầy đủ các dịch vụ hành chính trực tuyến."><form className="auth-form" onSubmit={submit} noValidate>{error && <div className="auth-alert error"><AlertCircle size={16}/>{error}</div>}<label>Email trường hoặc Mã SV/CBGV<div className="auth-input"><Mail size={17}/><input value={identity} onChange={event => { setIdentity(event.target.value); setError(''); }} placeholder="name@tbu.edu.vn hoặc mã định danh" autoComplete="username" /></div></label><label>Mật khẩu<div className="auth-input"><LockKeyhole size={17}/><input type="password" value={password} onChange={event => { setPassword(event.target.value); setError(''); }} placeholder="Nhập mật khẩu" autoComplete="current-password" /></div></label><div className="auth-options"><label className="auth-check"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)}/> Ghi nhớ đăng nhập</label><button type="button" className="auth-forgot" onClick={() => navigate('forgot-password')}>Quên mật khẩu?</button></div><button className="primary-btn auth-submit" type="submit"><LogInIcon/> Đăng nhập</button></form><div className="auth-divider"><span>Đăng nhập nhanh với tài khoản demo</span></div><div className="demo-login-grid"><button onClick={() => demo('student')}><span className="demo-avatar student">LA</span><span><b>Đăng nhập Sinh viên</b><small>lananh@tbu.edu.vn</small></span></button><button onClick={() => demo('staff')}><span className="demo-avatar staff">TH</span><span><b>Đăng nhập Cán bộ Một cửa</b><small>thuha@tbu.edu.vn</small></span></button><button onClick={() => demo('admin')}><span className="demo-avatar admin">AD</span><span><b>Đăng nhập Quản trị viên</b><small>admin@tbu.edu.vn</small></span></button></div><p className="auth-switch">Chưa có tài khoản? <button onClick={() => navigate('register')}>Đăng ký ngay</button></p></AuthShell>;
}

function Register({ onLogin, navigate }) {
  const [form, setForm] = useState({ name: '', code: '', email: '', phone: '', role: 'student', password: '', confirm: '', terms: false });
  const [error, setError] = useState('');
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.name || !form.code || !form.email || !form.password) return setError('Vui lòng điền các trường bắt buộc.');
    if (!/^[^@\s]+@tbu\.edu\.vn$/i.test(form.email)) return setError('Email phải sử dụng tên miền @tbu.edu.vn.');
    if (form.password.length < 6) return setError('Mật khẩu cần tối thiểu 6 ký tự.');
    if (form.password !== form.confirm) return setError('Mật khẩu xác nhận không khớp.');
    if (!form.terms) return setError('Vui lòng đồng ý với điều khoản sử dụng.');
    onLogin({ id: `user-${Date.now()}`, name: form.name, email: form.email, code: form.code, role: form.role, avatar: initials(form.name), phone: form.phone, department: form.role === 'student' ? 'Chưa cập nhật' : 'Chưa cập nhật' }, '✅ Đăng ký thành công, chào mừng bạn đến với cổng Một cửa!');
  };
  return <AuthShell title="Tạo tài khoản" subtitle="Đăng ký tài khoản để nộp và theo dõi hồ sơ trực tuyến."><form className="auth-form register-form" onSubmit={submit} noValidate>{error && <div className="auth-alert error"><AlertCircle size={16}/>{error}</div>}<div className="auth-two-col"><label>Họ và tên *<input value={form.name} onChange={event => update('name', event.target.value)} placeholder="Nguyễn Văn A"/></label><label>Mã định danh *<input value={form.code} onChange={event => update('code', event.target.value)} placeholder="MSV hoặc mã CBGV"/></label></div><div className="auth-two-col"><label>Email trường *<input value={form.email} onChange={event => update('email', event.target.value)} placeholder="name@tbu.edu.vn"/></label><label>Số điện thoại<input value={form.phone} onChange={event => update('phone', event.target.value)} placeholder="0988 123 456"/></label></div><fieldset><legend>Vai trò</legend><label className="role-radio"><input type="radio" checked={form.role === 'student'} onChange={() => update('role', 'student')}/> Sinh viên</label><label className="role-radio"><input type="radio" checked={form.role === 'staff'} onChange={() => update('role', 'staff')}/> Cán bộ - Giảng viên</label></fieldset><div className="auth-two-col"><label>Mật khẩu *<input type="password" value={form.password} onChange={event => update('password', event.target.value)} placeholder="Tối thiểu 6 ký tự"/></label><label>Xác nhận mật khẩu *<input type="password" value={form.confirm} onChange={event => update('confirm', event.target.value)} placeholder="Nhập lại mật khẩu"/></label></div><label className="auth-check terms"><input type="checkbox" checked={form.terms} onChange={event => update('terms', event.target.checked)}/> Tôi đồng ý với <button type="button">điều khoản sử dụng cổng Một cửa</button></label><button className="primary-btn auth-submit" type="submit"><UserCircle size={17}/> Đăng ký tài khoản</button></form><p className="auth-switch">Đã có tài khoản? <button onClick={() => navigate('login')}>Đăng nhập</button></p></AuthShell>;
}

function ForgotPassword({ navigate }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(60);
  useEffect(() => { if (!sent || seconds <= 0) return undefined; const timer = window.setInterval(() => setSeconds(value => value - 1), 1000); return () => window.clearInterval(timer); }, [sent, seconds]);
  const sendOtp = (event) => { event.preventDefault(); if (/^[^@\s]+@tbu\.edu\.vn$/i.test(email)) { setSent(true); setSeconds(60); } };
  return <AuthShell title="Quên mật khẩu?" subtitle="Nhập email trường để nhận mã xác nhận đặt lại mật khẩu."><form className="auth-form" onSubmit={sendOtp}>{!sent ? <><label>Email trường<div className="auth-input"><Mail size={17}/><input value={email} onChange={event => setEmail(event.target.value)} placeholder="name@tbu.edu.vn"/></div></label><button className="primary-btn auth-submit" type="submit"><KeyRound size={17}/> Gửi mã OTP</button></> : <><div className="auth-alert success"><CheckCircle2 size={16}/> Mã OTP đã được gửi đến {email}</div><label>Mã OTP<input value={otp} onChange={event => setOtp(event.target.value)} placeholder="Nhập 6 số xác nhận"/></label><label>Mật khẩu mới<input type="password" placeholder="Nhập mật khẩu mới"/></label><button className="primary-btn auth-submit" type="button" onClick={() => navigate('login')}>Đặt lại mật khẩu</button><p className="otp-countdown">{seconds > 0 ? `Có thể gửi lại sau ${seconds}s` : <button type="button" onClick={() => { setSeconds(60); setOtp(''); }}>Gửi lại mã OTP</button>}</p></>}</form><p className="auth-switch"><button onClick={() => navigate('login')}>← Quay lại đăng nhập</button></p></AuthShell>;
}

function LogInIcon() { return <ArrowRight size={17}/>; }

const adminMenu = [
  { section: 'TỔNG QUAN', items: [['Dashboard', LayoutDashboard]] },
  { section: 'QUẢN LÝ THỦ TỤC', items: [['Thủ tục hành chính', ClipboardList], ['Biểu mẫu', FileText], ['Quy trình', GitBranch]] },
  { section: 'QUẢN LÝ HỒ SƠ', items: [['Hồ sơ / Yêu cầu', FolderOpen]] },
  { section: 'AI & NỘI DUNG', items: [['Knowledge Base', Brain], ['FAQ', HelpCircle], ['Tin tức', Newspaper]] },
  { section: 'HỆ THỐNG', items: [['Người dùng', Users], ['Thống kê', BarChart3], ['Cài đặt', Settings]] }
];

const monthlyApplications = [
  { month: 'T10/25', value: 96 }, { month: 'T11', value: 112 }, { month: 'T12', value: 108 },
  { month: 'T1/26', value: 130 }, { month: 'T2', value: 118 }, { month: 'T3', value: 142 },
  { month: 'T4', value: 127 }, { month: 'T5', value: 151 }, { month: 'T6', value: 139 },
  { month: 'T7', value: 164 }, { month: 'T8', value: 147 }, { month: 'T9', value: 156 }
];
const departmentsData = [
  { name: 'Đào tạo', value: 42, color: '#245dcc' }, { name: 'TCCB', value: 23, color: '#4a83df' },
  { name: 'KHTC', value: 18, color: '#73a5ec' }, { name: 'Văn phòng', value: 11, color: '#a5c5f5' }, { name: 'Khác', value: 6, color: '#d5e4fa' }
];
const popularProcedures = [
  { name: 'Xác nhận SV', value: 82 }, { name: 'Cấp lại thẻ', value: 64 }, { name: 'Công tác phí', value: 51 },
  { name: 'Nghỉ phép', value: 43 }, { name: 'Phòng học', value: 35 }
];
const pendingApplications = [
  ['HS-001234', 'Nguyễn Lan Anh', 'Xác nhận sinh viên', '08/10/2026', 'Đang xử lý'],
  ['HS-001229', 'Trần Minh Đức', 'Thanh toán công tác phí', '08/10/2026', 'Chờ bổ sung'],
  ['HS-001218', 'Lê Thu Hà', 'Cấp giấy xác nhận công tác', '07/10/2026', 'Đang xử lý'],
  ['HS-001207', 'Phạm Hoàng Nam', 'Đề xuất nhiệm vụ KHCN', '06/10/2026', 'Quá hạn'],
  ['HS-001198', 'Đỗ Ngọc Mai', 'Cấp lại thẻ sinh viên', '05/10/2026', 'Đang xử lý']
];

const procedureManagementSeed = [
  { code: 'TT-TCCB-001', name: 'Đăng ký nghỉ phép năm', dept: 'Phòng Tổ chức Cán bộ', deptShort: 'TCCB', audience: 'CBGV', time: '3 ngày', steps: 4, active: true },
  { code: 'TT-TCCB-002', name: 'Đề nghị giải quyết chế độ thai sản', dept: 'Phòng Tổ chức Cán bộ', deptShort: 'TCCB', audience: 'CBGV', time: '5 ngày', steps: 5, active: true },
  { code: 'TT-TCCB-003', name: 'Ký kết hợp đồng lao động', dept: 'Phòng Tổ chức Cán bộ', deptShort: 'TCCB', audience: 'CBGV', time: '7 ngày', steps: 6, active: true },
  { code: 'TT-KHTC-001', name: 'Thanh toán tiền lương và phụ cấp', dept: 'Phòng Kế hoạch - Tài chính', deptShort: 'KHTC', audience: 'CBGV', time: '5 ngày', steps: 4, active: true },
  { code: 'TT-KHTC-002', name: 'Thanh toán công tác phí', dept: 'Phòng Kế hoạch - Tài chính', deptShort: 'KHTC', audience: 'CBGV', time: '5-7 ngày', steps: 5, active: false },
  { code: 'TT-KHCN-001', name: 'Đề xuất nhiệm vụ khoa học công nghệ', dept: 'Phòng KHCN & HTPT', deptShort: 'KHCN', audience: 'CBGV', time: '10 ngày', steps: 7, active: true },
  { code: 'TT-VP-001', name: 'Đăng ký sử dụng phòng học', dept: 'Văn phòng', deptShort: 'VP', audience: 'Tất cả', time: '2 ngày', steps: 3, active: true },
  { code: 'TT-ĐT-001', name: 'Cấp giấy xác nhận sinh viên', dept: 'Phòng Đào tạo', deptShort: 'ĐT', audience: 'Sinh viên', time: '1-2 ngày', steps: 3, active: true },
  { code: 'TT-ĐT-002', name: 'Xin cấp lại thẻ sinh viên', dept: 'Phòng Đào tạo', deptShort: 'ĐT', audience: 'Sinh viên', time: '3 ngày', steps: 4, active: true },
  { code: 'TT-ĐT-003', name: 'Đăng ký học lại / cải thiện điểm', dept: 'Phòng Đào tạo', deptShort: 'ĐT', audience: 'Sinh viên', time: '3-5 ngày', steps: 4, active: false }
];

const procedureDepartments = ['Phòng Tổ chức Cán bộ', 'Phòng Kế hoạch - Tài chính', 'Phòng KHCN & HTPT', 'Văn phòng', 'Phòng Đào tạo'];

function adminNavigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function AdminProcedures() {
  const { procedures: rows, setProcedures } = useDataStore();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [audience, setAudience] = useState('');
  const [selected, setSelected] = useState([]);
  const [editor, setEditor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const filtered = rows.filter((row) =>
    (!query || `${row.code} ${row.name}`.toLowerCase().includes(query.toLowerCase())) &&
    (!department || row.dept === department) &&
    (!status || (status === 'Hoạt động' ? row.active : !row.active)) &&
    (!audience || row.audience === audience)
  );
  const toggleAll = (checked) => setSelected(checked ? filtered.map(row => row.code) : []);
  const toggleRow = (code) => setSelected(value => value.includes(code) ? value.filter(item => item !== code) : [...value, code]);
  const updateStatus = (code) => setProcedures(value => value.map(row => row.code === code ? { ...row, active: !row.active } : row));
  const removeRows = (codes) => {
    setProcedures(value => value.filter(row => !codes.includes(row.code)));
    setSelected([]);
    setDeleteTarget(null);
  };
  return <div className="admin-shell admin-procedures-shell">
    <AdminSideRail active="Thủ tục hành chính" />
    <section className="admin-main">
      <AdminTopbar />
      <main className="admin-content procedures-admin-content">
        <div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>Quản lý</span><ArrowRight size={13} /><b>Thủ tục hành chính</b></div><h1>Quản lý Thủ tục Hành chính</h1><p>Quản lý danh mục, quy trình và thông tin chi tiết các thủ tục của trường.</p></div><button className="admin-primary-btn" onClick={() => setEditor({ mode: 'add' })}><Plus size={17} /> Thêm thủ tục</button></div>
        <div className="procedure-filter-bar"><div className="admin-filter-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm theo mã hoặc tên thủ tục..." /></div><select value={department} onChange={e => setDepartment(e.target.value)}><option value="">Tất cả phòng ban</option>{procedureDepartments.map(item => <option key={item}>{item}</option>)}</select><select value={status} onChange={e => setStatus(e.target.value)}><option value="">Tất cả trạng thái</option><option>Hoạt động</option><option>Tạm dừng</option></select><select value={audience} onChange={e => setAudience(e.target.value)}><option value="">Tất cả đối tượng</option><option>Sinh viên</option><option>CBGV</option><option>Tất cả</option></select><button className="reset-filter" onClick={() => { setQuery(''); setDepartment(''); setStatus(''); setAudience(''); }}>Đặt lại</button></div>
        {selected.length > 0 && <div className="bulk-toolbar"><span><b>{selected.length}</b> thủ tục đã chọn</span><button onClick={() => setProcedures(value => value.map(row => selected.includes(row.code) ? { ...row, active: true } : row))}><Check size={15} /> Kích hoạt</button><button onClick={() => setProcedures(value => value.map(row => selected.includes(row.code) ? { ...row, active: false } : row))}><Clock3 size={15} /> Tạm dừng</button><button className="bulk-delete" onClick={() => setDeleteTarget({ bulk: true })}><Trash2 size={15} /> Xóa đã chọn</button></div>}
        <div className="procedures-table-card"><div className="table-toolbar"><span>Danh sách thủ tục <b>{filtered.length}</b></span><small>Hiển thị 1-{filtered.length} trong tổng số 45</small></div><div className="admin-table-scroll"><table className="procedures-table"><thead><tr><th><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={e => toggleAll(e.target.checked)} /></th><th>MÃ THỦ TỤC</th><th>TÊN THỦ TỤC</th><th>PHÒNG BAN</th><th>ĐỐI TƯỢNG</th><th>THỜI GIAN</th><th>BƯỚC</th><th>TRẠNG THÁI</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{filtered.map(row => <tr key={row.code}><td><input type="checkbox" checked={selected.includes(row.code)} onChange={() => toggleRow(row.code)} /></td><td><b className="procedure-code">{row.code}</b></td><td><strong className="procedure-name">{row.name}</strong></td><td><span className={`dept-pill ${row.deptShort.toLowerCase()}`}>{row.deptShort}</span><small className="table-dept-full">{row.dept}</small></td><td><span className="audience-tag">{row.audience}</span></td><td>{row.time}</td><td>{row.steps} bước</td><td><button aria-label={`Đổi trạng thái ${row.name}`} onClick={() => updateStatus(row.code)} className={row.active ? 'status-toggle on' : 'status-toggle'}><span /></button><small className={row.active ? 'status-label active-label' : 'status-label'}>{row.active ? 'Hoạt động' : 'Tạm dừng'}</small></td><td><div className="row-actions"><button title="Xem"><Eye size={16} /></button><button title="Chỉnh sửa" onClick={() => setEditor({ mode: 'edit', row })}><Pencil size={16} /></button><button title="Xóa" className="danger-icon" onClick={() => setDeleteTarget(row)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div><div className="pagination"><span>Hiển thị <b>1-{filtered.length}</b> trong <b>45</b> thủ tục</span><div><button disabled>‹</button><button className="current-page">1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>›</button></div></div></div>
      </main>
    </section>
    {editor && <ProcedureEditor initial={editor.row} onClose={() => setEditor(null)} onSave={(item) => { setProcedures(value => editor.mode === 'edit' ? value.map(row => row.code === item.code ? item : row) : [item, ...value]); setEditor(null); }} />}
    {deleteTarget && <div className="modal-backdrop"><div className="delete-dialog"><div className="delete-symbol"><Trash2 size={22} /></div><h2>Xác nhận xóa thủ tục?</h2><p>{deleteTarget.bulk ? 'Bạn có chắc chắn muốn xóa các thủ tục đã chọn?' : <>Bạn có chắc chắn muốn xóa thủ tục <b>“{deleteTarget.name}”</b>?</>}<br />Hành động này không thể hoàn tác.</p><div className="modal-actions"><button className="admin-outline-btn" onClick={() => setDeleteTarget(null)}>Hủy</button><button className="delete-confirm" onClick={() => removeRows(deleteTarget.bulk ? selected : [deleteTarget.code])}><Trash2 size={15} /> Xóa thủ tục</button></div></div></div>}
  </div>;
}

function AdminSideRail({ active }) {
  const [collapsed, setCollapsed] = useState(false);
  return <aside className={collapsed ? 'admin-sidebar rail-collapsed' : 'admin-sidebar'}><button className="admin-logo" onClick={() => adminNavigate('/admin')}><span className="brand-mark"><Building2 size={21} /></span><span><b>ĐẠI HỌC THÁI BÌNH</b><small>QUẢN TRỊ HỆ THỐNG</small></span></button><nav className="admin-nav">{adminMenu.map(group => <div className="admin-nav-group" key={group.section}><small className="admin-section">{group.section}</small>{group.items.map(([label, Icon]) => <button onClick={() => label === 'Dashboard' ? adminNavigate('/admin') : label === 'Thủ tục hành chính' ? adminNavigate('/admin/procedures') : label === 'Biểu mẫu' ? adminNavigate('/admin/forms') : label === 'Quy trình' ? adminNavigate('/admin/processes') : label === 'Hồ sơ / Yêu cầu' ? adminNavigate('/admin/applications') : label === 'Knowledge Base' ? adminNavigate('/admin/knowledge-base') : label === 'Người dùng' ? adminNavigate('/admin/users') : label === 'FAQ' ? adminNavigate('/admin/faq') : label === 'Tin tức' ? adminNavigate('/admin/news')   : label === 'Thống kê' ? adminNavigate('/admin/reports') : label === 'Cài đặt' ? adminNavigate('/admin/settings') : undefined} className={label === active ? 'admin-nav-item active' : 'admin-nav-item'} key={label} title={label}><Icon size={18} /><span>{label}</span></button>)}</div>)}</nav><div className="admin-sidebar-bottom"><div className="admin-user"><span className="admin-avatar">AD</span><span><b>Admin</b><small>Quản trị viên</small></span><MoreHorizontal size={16} /></div><button className="logout-btn" onClick={() => adminNavigate('/')}><LogOut size={16} /><span>Đăng xuất</span></button><button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}<span>{collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}</span></button></div></aside>;
}

function ReceiptModal({ item, onClose }) {
  const [qr, setQr] = useState('');
  const trackingUrl = `${window.location.origin}/track?code=${encodeURIComponent(item.code)}`;
  useEffect(() => {
    let active = true;
    QRCode.toString(trackingUrl, { type: 'svg', margin: 1, width: 132 })
      .then(value => active && setQr(value))
      .catch(error => console.warn('Unable to generate receipt QR code', error));
    return () => { active = false; };
  }, [trackingUrl]);
  const printReceipt = () => window.print();
  const submittedAt = item.submittedAt ? new Date(item.submittedAt) : new Date();
  const expected = new Date(submittedAt.getTime() + 5 * 24 * 60 * 60 * 1000);
  return <div className="modal-backdrop receipt-backdrop"><div className="receipt-dialog"><div className="receipt-preview">
    <div className="receipt-header"><div><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><span>Độc lập - Tự do - Hạnh phúc</span></div><div><b>TRƯỜNG ĐẠI HỌC THÁI BÌNH</b><span>BỘ PHẬN TIẾP NHẬN VÀ TRẢ KẾT QUẢ</span></div></div>
    <h1>GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ</h1>
    <div className="receipt-code-row"><div><small>MÃ HỒ SƠ</small><strong>{item.code}</strong></div>{qr ? <div className="receipt-qr" dangerouslySetInnerHTML={{ __html: qr }} /> : <div className="receipt-qr-placeholder">QR</div>}</div>
    <div className="receipt-grid"><p><b>Người nộp hồ sơ:</b> {item.applicant}</p><p><b>Phòng ban phụ trách:</b> {item.dept || 'Bộ phận Một cửa'}</p><p><b>Thủ tục đăng ký:</b> {item.procedure}</p><p><b>Trạng thái:</b> {item.status || 'Tiếp nhận'}</p></div>
    <h2>Danh mục hồ sơ đã nộp</h2><ol className="receipt-documents">{(item.files || ['Tài liệu hồ sơ điện tử']).map((file, index) => <li key={`${file}-${index}`}>{file}</li>)}</ol>
    <div className="receipt-time"><p><b>Thời gian tiếp nhận:</b> {submittedAt.toLocaleString('vi-VN')}</p><p><b>Thời gian hẹn trả kết quả:</b> Dự kiến trong 3-5 ngày làm việc, trước {expected.toLocaleDateString('vi-VN')}</p></div>
    <p className="receipt-note">Quét mã QR để tra cứu tiến độ hồ sơ trên Cổng dịch vụ hành chính trực tuyến.</p>
    <div className="receipt-signatures"><div>Người nộp hồ sơ<br /><span>(Ký và ghi rõ họ tên)</span><strong>{item.applicant}</strong></div><div>Cán bộ tiếp nhận<br /><span>(Ký và ghi rõ họ tên)</span><strong>Bộ phận Một cửa</strong></div></div>
    </div><div className="receipt-actions"><button className="admin-outline-btn" onClick={onClose}>Đóng</button><button className="admin-primary-btn" onClick={printReceipt}><FileText size={15}/> In phiếu hẹn trả kết quả</button></div>
  </div></div>;
}

function NotificationButton({ audience = 'admin' }) {
  const { notifications, markNotificationsRead } = useDataStore();
  const [open, setOpen] = useState(false);
  const items = notifications.filter(item => item.audience === audience || (audience === 'admin' && item.audience === 'admin') || (audience === 'guest' && item.audience === 'guest')).slice(0, 8);
  const unread = items.filter(item => !item.read).length;
  const openApplication = item => {
    setOpen(false);
    if (item.code) {
      window.history.pushState({}, '', `${audience === 'admin' ? '/admin/applications' : '/track'}?code=${encodeURIComponent(item.code)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };
  return <div className="notification-wrap"><button className="admin-notification" aria-label="Thông báo" onClick={() => setOpen(value => !value)}><Bell size={18} />{unread > 0 && <i>{Math.min(unread, 9)}</i>}</button>{open && <div className="notification-menu"><div className="notification-menu-head"><b>Trung tâm thông báo</b><button onClick={markNotificationsRead}>Đánh dấu tất cả là đã đọc</button></div>{items.length ? items.map(item => <button className={item.read ? 'notification-item read' : 'notification-item'} key={item.id} onClick={() => openApplication(item)}><span className={`notification-dot ${item.type === 'new-application' ? 'blue' : item.type === 'application-status' ? 'green' : 'orange'}`} /><p><b>{item.type === 'new-application' ? 'Hồ sơ mới' : item.type === 'application-status' ? 'Cập nhật tiến độ' : 'Nhắc nhở quá hạn'}</b><br />{item.text}<small>{new Date(item.createdAt).toLocaleString('vi-VN')}</small></p></button>) : <div className="notification-empty">Không có thông báo</div>}</div>}</div>;
}

function AdminTopbar({ title = 'Thủ tục hành chính' }) {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark-mode'));
  const toggleTheme = () => { setDarkMode(value => !value); document.documentElement.classList.toggle('dark-mode', !darkMode); localStorage.setItem('tbu-theme', !darkMode ? 'dark' : 'light'); };
  return <header className="admin-topbar"><div className="admin-breadcrumb"><span>Quản lý</span><ArrowRight size={13} /><b>{title}</b></div><div className="admin-top-actions"><button className="admin-search" aria-label="Tìm kiếm"><Search size={17} /><span>Tìm kiếm...</span><kbd>⌘ K</kbd></button><button className="theme-toggle" aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} onClick={toggleTheme}>{darkMode ? '☀' : '◐'}</button><NotificationButton audience="admin" /><div className="admin-top-user"><span className="admin-avatar">AD</span><span><b>Admin</b><small>Quản trị viên</small></span><ChevronDown size={14} /></div></div></header>;
}

const knowledgeSeed = [
  ['HD-001','Quy chế đào tạo đại học chính quy năm 2026','Quy chế','PDF','2.4 MB','86','Đã index','08/10/2026'],
  ['HD-002','Hướng dẫn đăng ký xác nhận sinh viên','Thủ tục','PDF','1.2 MB','64','Đã index','08/10/2026'],
  ['HD-003','Quy trình tiếp nhận và xử lý hồ sơ Một cửa','Quy trình','DOCX','845 KB','52','Đã index','07/10/2026'],
  ['HD-004','Quy định chế độ nghỉ phép, thai sản','TCCB','PDF','3.1 MB','118','Đã index','06/10/2026'],
  ['HD-005','Hướng dẫn thanh toán công tác phí','Tài chính','DOCX','620 KB','43','Đang xử lý','10/10/2026'],
  ['HD-006','Quy chế quản lý và sử dụng tài sản','Quy chế','PDF','1.8 MB','79','Đã index','05/10/2026'],
  ['HD-007','Quy trình ký kết hợp đồng lao động','Quy trình','DOCX','955 KB','61','Đã index','04/10/2026'],
  ['HD-008','Danh mục biểu mẫu hành chính năm 2026','Biểu mẫu','XLSX','410 KB','37','Đã index','03/10/2026'],
  ['HD-009','Quy định đào tạo sau đại học','Đào tạo','PDF','2.8 MB','92','Lỗi','02/10/2026'],
  ['HD-010','Hướng dẫn đề xuất nhiệm vụ khoa học công nghệ','KHCN','DOCX','1.1 MB','75','Đã index','01/10/2026'],
  ['HD-011','Sổ tay sinh viên Trường Đại học Thái Bình','Sinh viên','PDF','4.6 MB','143','Đã index','29/09/2026'],
  ['HD-012','Quy định cấp phát và sử dụng thẻ sinh viên','Sinh viên','TXT','180 KB','28','Đã index','28/09/2026']
].map(([code,name,category,type,size,chunks,status,date]) => ({code,name,category,type,size,chunks,status,date}));

function AdminKnowledgeBase() {
  const { knowledgeBase: documents, setKnowledgeBase: setDocuments } = useDataStore();
  const [query,setQuery] = useState('');
  const [status,setStatus] = useState('');
  const [category,setCategory] = useState('');
  const [tab,setTab] = useState('documents');
  const [upload,setUpload] = useState(false);
  const [chunks,setChunks] = useState(null);
  const [rag,setRag] = useState(false);
  const [reindex,setReindex] = useState(false);
  const filtered=documents.filter(d=>(!query||d.name.toLowerCase().includes(query.toLowerCase()))&&(!status||d.status===status)&&(!category||d.category===category));
  return <div className="admin-shell"><AdminSideRail active="Knowledge Base"/><section className="admin-main"><AdminTopbar title="Knowledge Base"/><main className="admin-content kb-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>AI & Nội dung</span><ArrowRight size={13}/><b>Knowledge Base</b></div><h1>Quản lý Knowledge Base</h1><p>Quản lý tài liệu cho AI Chatbot (RAG)</p></div><div className="kb-header-actions"><button className="admin-outline-btn" onClick={()=>setRag(true)}><SlidersHorizontal size={15}/> Test Query RAG</button><button className="admin-primary-btn" onClick={()=>setUpload(true)}><Plus size={16}/> Upload tài liệu</button></div></div><div className="kb-stats"><div><span className="kb-stat-icon blue"><FileStack size={21}/></span><small>Tổng tài liệu</small><strong>45</strong><em>+3 tháng này</em></div><div><span className="kb-stat-icon green"><Database size={21}/></span><small>Đã index</small><strong>42</strong><em className="green-text">93.3% hoàn tất</em></div><div><span className="kb-stat-icon purple"><Layers size={21}/></span><small>Tổng chunks</small><strong>1,234</strong><em>Avg. 29 tokens/chunk</em></div></div><div className="kb-tabs"><button className={tab==='documents'?'selected':''} onClick={()=>setTab('documents')}>Danh sách tài liệu</button><button className={tab==='settings'?'selected':''} onClick={()=>setTab('settings')}>Cài đặt RAG</button></div>{tab==='documents'?<><div className="kb-toolbar"><div className="admin-filter-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm kiếm tài liệu..."/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Tất cả trạng thái</option><option>Đã index</option><option>Đang xử lý</option><option>Lỗi</option></select><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Tất cả danh mục</option>{[...new Set(documents.map(d=>d.category))].map(x=><option key={x}>{x}</option>)}</select><button className="reindex-btn" onClick={()=>setReindex(true)}><RefreshCw size={14}/> Re-index tất cả</button></div><div className="kb-table-card"><div className="table-toolbar"><span>Kho tài liệu <b>{filtered.length}</b></span><small>Đã cập nhật lần cuối: 10/10/2026 · 09:30</small></div><div className="admin-table-scroll"><table className="procedures-table kb-table"><thead><tr><th>□</th><th>FILE</th><th>TÊN TÀI LIỆU</th><th>DANH MỤC</th><th>KÍCH THƯỚC</th><th>CHUNKS</th><th>TRẠNG THÁI</th><th>NGÀY UPLOAD</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{filtered.map(doc=><tr key={doc.code}><td><input type="checkbox"/></td><td><span className={`file-type ${doc.type.toLowerCase().includes('doc')?'doc':'pdf'}`}><FileText size={17}/></span></td><td><strong className="procedure-name">{doc.name}</strong><small className="table-dept-full">{doc.code}</small></td><td><span className="audience-tag">{doc.category}</span></td><td>{doc.size}</td><td><b>{doc.chunks}</b></td><td><span className={`kb-status ${doc.status==='Đã index'?'indexed':doc.status==='Lỗi'?'error':'indexing'}`}>{doc.status==='Đã index'?'✓':doc.status==='Lỗi'?'×':'◌'} {doc.status}</span></td><td>{doc.date}</td><td><div className="row-actions"><button title="Preview chunks" onClick={()=>setChunks(doc)}><Eye size={16}/></button><button title="Re-index"><RefreshCw size={15}/></button><button title="Xóa" className="danger-icon" onClick={()=>setDocuments(value=>value.filter(x=>x.code!==doc.code))}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div><div className="pagination"><span>Hiển thị <b>1-{filtered.length}</b> trong <b>45</b> tài liệu</span><div><button className="current-page">1</button><button>2</button><button>3</button><button>›</button></div></div></div><div className="kb-health"><span><i/> Index health: <b>Ổn định</b></span><span>Last indexed: 10/10/2026 · 09:30</span><button onClick={()=>setReindex(true)}>Xem chi tiết</button></div></>:<RagSettings/>}</main></section>{upload&&<KnowledgeUpload onClose={()=>setUpload(false)} onUpload={items=>{setDocuments(value=>[...items,...value]);setUpload(false)}}/>}{chunks&&<ChunkPreview doc={chunks} onClose={()=>setChunks(null)}/>} {rag&&<RagPanel onClose={()=>setRag(false)}/>} {reindex&&<ReindexDialog onClose={()=>setReindex(false)}/>}</div>;
}

function KnowledgeUpload({onClose,onUpload}) {
  const [files,setFiles]=useState([{name:'tai-lieu-moi.pdf',size:'1.4 MB',category:'Thủ tục',progress:78}]);
  return <div className="modal-backdrop"><div className="upload-dialog kb-upload-dialog"><div className="editor-header"><div><span className="label">CƠ SỞ TRI THỨC AI</span><h2>Upload tài liệu</h2><p>Tài liệu sẽ được tự động phân tích và đưa vào RAG.</p></div><button onClick={onClose}><X size={20}/></button></div><div className="upload-body"><div className="drop-zone admin-drop"><UploadCloud size={28}/><b>Kéo thả tệp vào đây hoặc <span>chọn tệp</span></b><small>DOC, DOCX, PDF, TXT, XLS · Có thể upload nhiều file</small></div><p className="kb-info-note"><Brain size={15}/> Tài liệu sẽ được tự động phân tích, chia nhỏ (chunking) và đưa vào cơ sở tri thức AI</p>{files.map((file,index)=><div className="kb-upload-file" key={index}><span className="file-type pdf"><FileText size={17}/></span><div><b>{file.name}</b><small>{file.size} · Đang xử lý</small><div className="upload-progress"><span style={{width:`${file.progress}%`}}/></div></div><select value={file.category} onChange={e=>setFiles(value=>value.map((x,i)=>i===index?{...x,category:e.target.value}:x))}><option>Thủ tục</option><option>Quy chế</option><option>Biểu mẫu</option><option>Đào tạo</option></select></div>)}</div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-primary-btn" onClick={()=>onUpload(files.map((x,i)=>({code:`HD-NEW-${i}`,name:x.name,category:x.category,type:'PDF',size:x.size,chunks:'0',status:'Đang xử lý',date:'10/10/2026'})))}><UploadCloud size={15}/> Tải lên & Xử lý</button></div></div></div>;
}

const chunkSample=['Trường Đại học Thái Bình tiếp nhận hồ sơ trực tuyến qua Cổng dịch vụ hành chính. Người dùng cần đăng nhập bằng tài khoản email trường để bắt đầu quy trình.','Hồ sơ đăng ký xác nhận sinh viên gồm: đơn đề nghị theo mẫu, thẻ sinh viên hoặc giấy tờ tùy thân và các tài liệu liên quan. Thời gian xử lý dự kiến từ 1 đến 2 ngày làm việc.','Sau khi hồ sơ được tiếp nhận, Phòng Đào tạo kiểm tra tính đầy đủ và gửi thông báo kết quả qua email. Người nộp có thể tra cứu bằng mã hồ sơ.'];
function ChunkPreview({doc,onClose}) {
  return <div className="modal-backdrop"><div className="chunk-dialog"><div className="editor-header"><div><span className="label">CHUNK PREVIEW</span><h2>{doc.name}</h2><p>{doc.chunks} chunks · {doc.size} · Đã index</p></div><button onClick={onClose}><X size={20}/></button></div><div className="chunk-list">{chunkSample.map((text,index)=><div className="chunk-card" key={index}><div><b>#{index+1}</b><span>128 tokens</span></div><p>{text}</p><small>Trang {index+1} · Mục: Hướng dẫn thủ tục</small></div>)}</div><div className="chunk-footer"><span>Tổng chunks <b>{doc.chunks}</b></span><span>Tokens trung bình <b>128</b></span></div></div></div>;
}

function RagPanel({onClose}) {
  const [question,setQuestion]=useState('Hồ sơ xin nghỉ phép năm gồm những giấy tờ gì?');
  const [searched,setSearched]=useState(false);
  return <div className="application-detail-backdrop"><aside className="rag-panel"><div className="detail-header"><div><span className="label">AI EVALUATION</span><h2>Test Query RAG</h2><small>Kiểm tra chất lượng truy xuất và câu trả lời AI</small></div><button onClick={onClose}><X size={19}/></button></div><div className="rag-body"><div className="rag-input"><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Nhập câu hỏi test..."/><button onClick={()=>setSearched(true)}>Tìm kiếm <Search size={14}/></button></div>{searched&&<><h3>Retrieved Chunks <span>Top-K: 3</span></h3>{['Quy định chế độ nghỉ phép, thai sản.pdf','Quy trình tiếp nhận và xử lý hồ sơ Một cửa','Danh mục biểu mẫu hành chính năm 2026'].map((source,index)=><div className="retrieved-chunk" key={source}><div><b>#{index+1}</b><span>Relevance {(0.96-index*0.08).toFixed(2)}</span></div><strong>{source}</strong><p>... người lao động cần chuẩn bị <mark>đơn xin nghỉ phép</mark> theo mẫu và gửi về đơn vị quản lý trực tiếp ...</p></div>)}<h3>Generated Answer</h3><div className="generated-answer"><p>Để xin nghỉ phép năm, bạn cần chuẩn bị đơn xin nghỉ phép theo mẫu của trường và gửi cho đơn vị quản lý trực tiếp phê duyệt. Hồ sơ thường được xử lý trong 3 ngày làm việc.</p><small>Model: gemini-2.0-flash · Latency: 1.2s</small></div><div className="rag-feedback">Đánh giá kết quả <button><ThumbsUp size={15}/></button><button><ThumbsDown size={15}/></button></div></>}</div></aside></div>;
}

function ReindexDialog({onClose}) {
  return <div className="modal-backdrop"><div className="delete-dialog reindex-dialog"><div className="delete-symbol"><RefreshCw size={22}/></div><h2>Re-index tất cả tài liệu?</h2><p>Quá trình này sẽ phân tích lại 45 tài liệu và có thể mất vài phút.</p><div className="reindex-progress"><span style={{width:'68%'}}/></div><small>Đang xử lý 68% · 30/45 tài liệu</small><div className="modal-actions"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-primary-btn" onClick={onClose}>Tiếp tục</button></div></div></div>;
}

function RagSettings() {
  return <div className="rag-settings"><div className="settings-grid"><label>Chunk size <b>512 tokens</b><input type="range" min="256" max="2048" defaultValue="512"/></label><label>Chunk overlap <b>128 tokens</b><input type="range" min="0" max="256" defaultValue="128"/></label><label>Top-K results <b>5</b><input type="range" min="1" max="10" defaultValue="5"/></label><label>Temperature <b>0.3</b><input type="range" min="0" max="1" step=".1" defaultValue=".3"/></label></div><label className="embedding-label">Embedding model<select><option>text-embedding-004</option><option>text-embedding-3-small</option></select></label><label className="system-prompt">System prompt<textarea rows="6" defaultValue="Bạn là trợ lý AI của Bộ phận Một cửa - Trường Đại học Thái Bình. Hãy trả lời chính xác dựa trên tài liệu được cung cấp, ưu tiên hướng dẫn rõ ràng theo từng bước." /></label><button className="admin-primary-btn"><Save size={15}/> Lưu cài đặt</button></div>;
}

const reportApplications = [{name:'Xác nhận sinh viên',count:126,done:112,processing:11,late:3,avg:'1.8 ngày'},{name:'Cấp lại thẻ sinh viên',count:82,done:77,processing:4,late:1,avg:'2.1 ngày'},{name:'Thanh toán công tác phí',count:68,done:55,processing:10,late:3,avg:'4.6 ngày'},{name:'Nghỉ phép năm',count:57,done:51,processing:5,late:1,avg:'2.7 ngày'},{name:'Đề xuất nhiệm vụ KHCN',count:44,done:35,processing:7,late:2,avg:'7.2 ngày'}];
const reportTimeline=[{label:'01/10',received:28,completed:23},{label:'02/10',received:34,completed:28},{label:'03/10',received:31,completed:29},{label:'04/10',received:42,completed:35},{label:'05/10',received:39,completed:34},{label:'06/10',received:48,completed:39},{label:'07/10',received:45,completed:42},{label:'08/10',received:51,completed:44},{label:'09/10',received:46,completed:43},{label:'10/10',received:52,completed:47}];
const departmentReport=[{name:'Đào tạo',value:168},{name:'TCCB',value:112},{name:'KHTC',value:78},{name:'KHCN',value:54},{name:'Văn phòng',value:44}];
const statusReport=[{name:'Hoàn thành',value:398,color:'#2b9c79'},{name:'Đang xử lý',value:45,color:'#e3a02b'},{name:'Quá hạn',value:13,color:'#d85a65'}];
const chatbotTimeline=[{label:'01/10',value:198},{label:'02/10',value:221},{label:'03/10',value:205},{label:'04/10',value:267},{label:'05/10',value:248},{label:'06/10',value:302},{label:'07/10',value:284},{label:'08/10',value:276},{label:'09/10',value:244},{label:'10/10',value:300}];
const topicReport=[{name:'Nghỉ phép',value:420},{name:'Biểu mẫu',value:368},{name:'Lương',value:295},{name:'Tuyển dụng',value:244},{name:'HĐLĐ',value:210},{name:'Tra cứu',value:188}];
const questionReport=[['Hồ sơ xin nghỉ phép cần những gì?',48,'01-10/10'],['Tôi có thể tải biểu mẫu ở đâu?',36,'01-10/10'],['Thời gian cấp giấy xác nhận sinh viên?',29,'01-10/10'],['Cách theo dõi trạng thái hồ sơ?',24,'01-10/10']];
const formReport=[['Đơn xin nghỉ phép năm','Nghỉ phép',842,126,'+18%'],['Đơn xác nhận sinh viên','Đào tạo',716,98,'+12%'],['Thanh toán công tác phí','Lương',543,72,'+8%'],['Đơn xin nghỉ thai sản','Nghỉ phép',421,45,'+5%'],['Đề xuất nhiệm vụ KHCN','Tập huấn',318,39,'-3%']];
const formDownloads=[{label:'01/10',value:142},{label:'02/10',value:168},{label:'03/10',value:155},{label:'04/10',value:207},{label:'05/10',value:198},{label:'06/10',value:236},{label:'07/10',value:214},{label:'08/10',value:263},{label:'09/10',value:245},{label:'10/10',value:251}];

function ReportCard({label,value,detail,color='blue'}){return <div className="report-summary-card"><span className={`report-card-icon ${color}`}><BarChart3 size={19}/></span><small>{label}</small><strong>{value}</strong><em className={color==='red'?'red-text':''}>{detail}</em></div>}
function ReportsChart({title,children,wide=false}){return <div className={wide?'report-chart-card wide':'report-chart-card'}><h2>{title}</h2>{children}</div>}
function AdminReports(){const { applications } = useDataStore(); const [tab,setTab]=useState('applications'),[range,setRange]=useState('30 ngày');return <div className="admin-shell"><AdminSideRail active="Thống kê"/><section className="admin-main"><AdminTopbar title="Thống kê & Báo cáo"/><main className="admin-content reports-content"><div className="reports-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>Hệ thống</span><ArrowRight size={13}/><b>Thống kê & Báo cáo</b></div><h1>Thống kê & Báo cáo</h1><p>Phân tích dữ liệu vận hành và hiệu quả dịch vụ Một cửa.</p></div><div className="report-actions"><select value={range} onChange={e=>setRange(e.target.value)}>{['Hôm nay','7 ngày','30 ngày','Quý này','Năm nay','Tùy chọn'].map(x=><option key={x}>{x}</option>)}</select><button onClick={() => downloadCsv(`bao-cao-ho-so-${new Date().toISOString().slice(0,10)}.csv`, applicationCsvRows(applications))}><Download size={14}/> Xuất Excel</button><button><FileText size={14}/> Xuất PDF</button></div></div><div className="report-tabs">{[['applications','Hồ sơ'],['chatbot','Chatbot AI'],['forms','Biểu mẫu']].map(([key,label])=><button className={tab===key?'selected':''} onClick={()=>setTab(key)} key={key}>{label}</button>)}</div>{tab==='applications'?<ApplicationReports/>:tab==='chatbot'?<ChatbotReports/>:<FormReports/>}</main></section></div>}
function ApplicationReports(){return <><div className="report-summary-grid">{[['Tổng hồ sơ nhận','456','So với kỳ trước +12%','blue'],['Đã hoàn thành','398','87.3% tổng hồ sơ','green'],['Đang xử lý','45','9.9% tổng hồ sơ','amber'],['Quá hạn','13','2.8% · Cần ưu tiên','red']].map(x=><ReportCard key={x[0]} label={x[0]} value={x[1]} detail={x[2]} color={x[3]}/>)}</div><div className="reports-chart-grid"><ReportsChart title="Xu hướng hồ sơ theo thời gian" wide><ResponsiveContainer width="100%" height={255}><LineChart data={reportTimeline}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f7"/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#8290a5'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#8290a5'}}/><Tooltip/><Legend/><Line dataKey="received" name="Tiếp nhận" stroke="#245dcc" strokeWidth={3}/><Line dataKey="completed" name="Hoàn thành" stroke="#2b9c79" strokeWidth={3}/></LineChart></ResponsiveContainer></ReportsChart><ReportsChart title="Phân bố trạng thái"><ResponsiveContainer width="100%" height={255}><PieChart><Pie data={statusReport} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3}>{statusReport.map(x=><Cell key={x.name} fill={x.color}/>)}</Pie><Tooltip/><Legend iconType="circle"/></PieChart></ResponsiveContainer></ReportsChart></div><div className="reports-chart-grid"><ReportsChart title="Hồ sơ theo phòng ban"><ResponsiveContainer width="100%" height={250}><BarChart data={departmentReport} layout="vertical" margin={{left:25,right:15}}><CartesianGrid horizontal={false} stroke="#edf1f7"/><XAxis type="number" axisLine={false} tickLine={false}/><YAxis dataKey="name" type="category" width={75} axisLine={false} tickLine={false} tick={{fontSize:10}}/><Tooltip/><Bar dataKey="value" fill="#3b73d8" radius={[0,5,5,0]} barSize={20}/></BarChart></ResponsiveContainer></ReportsChart><ReportsChart title="Phân bố thời gian xử lý"><div className="heatmap">{['T2','T3','T4','T5','T6','T7'].map((day,i)=><div key={day}><small>{day}</small>{[1,2,3,4].map(n=><span className={`heat-${(i+n)%5}`} key={n} title={`${day}: ${n+1} ngày`}/>)}</div>)}</div><p className="heatmap-caption">Màu đậm thể hiện số hồ sơ xử lý nhiều hơn</p></ReportsChart></div><ReportProcedureTable/></>}
function ReportProcedureTable(){return <div className="report-table-card"><div className="report-card-title"><h2>Chi tiết theo thủ tục</h2><button>Xuất dữ liệu <ArrowRight size={13}/></button></div><div className="admin-table-scroll"><table><thead><tr><th>TÊN THỦ TỤC</th><th>SỐ LƯỢNG</th><th>HOÀN THÀNH</th><th>ĐANG XL</th><th>QUÁ HẠN</th><th>THỜI GIAN TB</th></tr></thead><tbody>{reportApplications.map(x=><tr key={x.name}><td><b>{x.name}</b></td><td>{x.count}</td><td className="green-text">{x.done}</td><td>{x.processing}</td><td className="red-text">{x.late}</td><td>{x.avg}</td></tr>)}</tbody></table></div></div>}
function ChatbotReports(){return <><div className="report-summary-grid">{[['Tổng câu hỏi','2,345','+18% so với kỳ trước','blue'],['Tỷ lệ trả lời thành công','92%','Mục tiêu 90%','green'],['Thời gian phản hồi TB','1.8s','-0.3s so với kỳ trước','purple'],['Độ hài lòng','4.2/5 ⭐','Từ 1,876 đánh giá','amber']].map(x=><ReportCard key={x[0]} label={x[0]} value={x[1]} detail={x[2]} color={x[3]}/>)}</div><div className="reports-chart-grid"><ReportsChart title="Số câu hỏi theo ngày" wide><ResponsiveContainer width="100%" height={255}><LineChart data={chatbotTimeline}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f7"/><XAxis dataKey="label" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Line dataKey="value" name="Câu hỏi" stroke="#7455c7" strokeWidth={3}/></LineChart></ResponsiveContainer></ReportsChart><ReportsChart title="Phân loại câu hỏi"><ResponsiveContainer width="100%" height={255}><PieChart><Pie data={[{name:'Thủ tục',value:38},{name:'Biểu mẫu',value:26},{name:'Quy trình',value:21},{name:'Thông tin chung',value:15}]} dataKey="value" innerRadius={58} outerRadius={85}>{['#245dcc','#4c82da','#7ba6e9','#bfd4f5'].map(x=><Cell key={x} fill={x}/>)}</Pie><Tooltip/><Legend iconType="circle"/></PieChart></ResponsiveContainer></ReportsChart></div><div className="reports-chart-grid"><ReportsChart title="Chủ đề phổ biến" wide><ResponsiveContainer width="100%" height={245}><BarChart data={topicReport}><CartesianGrid vertical={false} stroke="#edf1f7"/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10}}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" name="Số câu hỏi" fill="#527ed1" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></ReportsChart><ReportsChart title="Phân bố đánh giá"><ResponsiveContainer width="100%" height={245}><BarChart data={[{star:'1 ⭐',value:25},{star:'2 ⭐',value:47},{star:'3 ⭐',value:154},{star:'4 ⭐',value:612},{star:'5 ⭐',value:1038}]}><CartesianGrid vertical={false} stroke="#edf1f7"/><XAxis dataKey="star" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill="#e2a02b"/></BarChart></ResponsiveContainer></ReportsChart></div><div className="report-table-card"><div className="report-card-title"><h2>Câu hỏi AI không trả lời được</h2><span className="report-muted">Tổng 137 câu hỏi</span></div><table><thead><tr><th>CÂU HỎI</th><th>SỐ LẦN</th><th>KHOẢNG THỜI GIAN</th></tr></thead><tbody>{questionReport.map(x=><tr key={x[0]}><td><b>{x[0]}</b></td><td>{x[1]}</td><td>{x[2]}</td></tr>)}</tbody></table></div></>}
function FormReports(){return <><div className="report-summary-grid form-summary-grid">{[['Tổng biểu mẫu','45','+3 tháng này','blue'],['Tổng lượt tải','5,678','+14% so với kỳ trước','green'],['Biểu mẫu phổ biến nhất','Đơn xin nghỉ phép','842 lượt tải','purple']].map(x=><ReportCard key={x[0]} label={x[0]} value={x[1]} detail={x[2]} color={x[3]}/>)}</div><div className="reports-chart-grid"><ReportsChart title="Top 10 biểu mẫu được tải nhiều nhất" wide><ResponsiveContainer width="100%" height={270}><BarChart data={formReport.map(x=>({name:x[0].slice(0,18),value:x[2]}))} layout="vertical" margin={{left:20,right:15}}><CartesianGrid horizontal={false} stroke="#edf1f7"/><XAxis type="number" axisLine={false} tickLine={false}/><YAxis dataKey="name" type="category" width={125} axisLine={false} tickLine={false} tick={{fontSize:9}}/><Tooltip/><Bar dataKey="value" fill="#3069c9" radius={[0,5,5,0]} barSize={18}/></BarChart></ResponsiveContainer></ReportsChart><ReportsChart title="Lượt tải theo thời gian"><ResponsiveContainer width="100%" height={270}><LineChart data={formDownloads}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f7"/><XAxis dataKey="label" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Line dataKey="value" name="Lượt tải" stroke="#2c9c7b" strokeWidth={3}/></LineChart></ResponsiveContainer></ReportsChart></div><div className="report-table-card"><div className="report-card-title"><h2>Chi tiết biểu mẫu</h2><button>Xuất dữ liệu <ArrowRight size={13}/></button></div><table><thead><tr><th>TÊN BIỂU MẪU</th><th>DANH MỤC</th><th>LƯỢT TẢI</th><th>LƯỢT TẢI THÁNG NÀY</th><th>XU HƯỚNG</th></tr></thead><tbody>{formReport.map(x=><tr key={x[0]}><td><b>{x[0]}</b></td><td><span className="audience-tag">{x[1]}</span></td><td>{x[2].toLocaleString()}</td><td>{x[3]}</td><td className={x[4].startsWith('+')?'green-text':'red-text'}>{x[4]} ↗</td></tr>)}</tbody></table></div></>}

const userSeed = [
  ['Nguyễn Lan Anh','lananh@tbu.edu.vn','21D100123','Sinh viên','Active','08/09/2024','08/10/2026'],['Trần Minh Đức','minhduc@tbu.edu.vn','CBGV-0182','CBGV','Active','11/03/2023','09/10/2026'],['Lê Thu Hà','thuha@tbu.edu.vn','CBGV-0145','Cán bộ xử lý','Active','02/01/2022','10/10/2026'],['Phạm Hoàng Nam','namph@tbu.edu.vn','21D120056','Sinh viên','Active','15/09/2024','07/10/2026'],['Đỗ Ngọc Mai','ngocmai@tbu.edu.vn','21D110089','Sinh viên','Active','15/09/2024','08/10/2026'],['Vũ Quang Huy','quanghuy@tbu.edu.vn','CBGV-0211','CBGV','Locked','10/02/2023','01/10/2026'],['Nguyễn Thị Hương','huongnt@tbu.edu.vn','CBGV-0048','Cán bộ xử lý','Active','12/08/2021','10/10/2026'],['Bùi Gia Bảo','giabao@tbu.edu.vn','22D100222','Sinh viên','Active','05/09/2025','06/10/2026'],['Hoàng Minh Tuấn','tuanhm@tbu.edu.vn','CBGV-0320','CBGV','Active','20/04/2024','05/10/2026'],['Lê Thùy Linh','linhlt@tbu.edu.vn','21D130077','Sinh viên','Active','15/09/2024','09/10/2026'],['Đặng Văn Long','longdv@tbu.edu.vn','CBGV-0075','Admin','Active','04/01/2021','10/10/2026'],['Phan Ngọc Ánh','ngocanh@tbu.edu.vn','22D100318','Sinh viên','Active','05/09/2025','08/10/2026'],['Nguyễn Đức Anh','ducanh@tbu.edu.vn','CBGV-0225','CBGV','Locked','12/06/2023','28/09/2026'],['Trần Thị Mai','thimai@tbu.edu.vn','CBGV-0119','Cán bộ xử lý','Active','09/05/2022','10/10/2026'],['Lương Quốc Việt','quocviet@tbu.edu.vn','23D100012','Sinh viên','Active','05/09/2026','09/10/2026'],['Mai Hoàng Yến','hoangyen@tbu.edu.vn','CBGV-0188','CBGV','Active','18/02/2023','07/10/2026']
].map((u,i)=>({id:i+1,name:u[0],email:u[1],code:u[2],role:u[3],status:u[4],created:u[5],last:u[6]}));

function AdminUsers(){
  const [users,setUsers]=useState(userSeed),[query,setQuery]=useState(''),[role,setRole]=useState(''),[status,setStatus]=useState(''),[modal,setModal]=useState(null),[tab,setTab]=useState('users');
  const filtered=users.filter(u=>(!query||`${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))&&(!role||u.role===role)&&(!status||u.status===status));
  return <div className="admin-shell"><AdminSideRail active="Người dùng"/><section className="admin-main"><AdminTopbar title="Người dùng"/><main className="admin-content users-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>Hệ thống</span><ArrowRight size={13}/><b>Người dùng</b></div><h1>Quản lý Người dùng</h1><p>Quản lý tài khoản, vai trò và quyền truy cập hệ thống.</p></div><button className="admin-primary-btn" onClick={()=>setModal({mode:'add'})}><Plus size={16}/> Thêm người dùng</button></div><div className="user-stats">{[['Tổng người dùng','1,234','users'],['Sinh viên','1,100','student'],['CBGV','120','staff'],['Admin','14','admin']].map(x=><div key={x[0]}><span className={`user-stat-icon ${x[2]}`}><Users size={18}/></span><small>{x[0]}</small><strong>{x[1]}</strong></div>)}</div><div className="kb-tabs"><button className={tab==='users'?'selected':''} onClick={()=>setTab('users')}>Danh sách người dùng</button><button className={tab==='permissions'?'selected':''} onClick={()=>setTab('permissions')}>Phân quyền</button></div>{tab==='users'?<><div className="procedure-filter-bar"><div className="admin-filter-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm theo họ tên hoặc email..."/></div><select value={role} onChange={e=>setRole(e.target.value)}><option value="">Tất cả vai trò</option><option>Admin</option><option>Cán bộ xử lý</option><option>Sinh viên</option><option>CBGV</option></select><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Tất cả trạng thái</option><option>Active</option><option>Locked</option></select></div><div className="procedures-table-card"><div className="table-toolbar"><span>Danh sách người dùng <b>{filtered.length}</b></span><small>Hiển thị 1-{filtered.length} trong tổng số 1,234</small></div><div className="admin-table-scroll"><table className="procedures-table users-table"><thead><tr><th>□</th><th>NGƯỜI DÙNG</th><th>EMAIL</th><th>MÃ SV/CBGV</th><th>VAI TRÒ</th><th>TRẠNG THÁI</th><th>NGÀY TẠO</th><th>ĐĂNG NHẬP CUỐI</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{filtered.map(u=><tr key={u.id}><td><input type="checkbox"/></td><td><span className="user-cell-avatar">{u.name.split(' ').slice(-1)[0][0]}{u.name.split(' ').slice(-2,-1)[0]?.[0]}</span><strong>{u.name}</strong></td><td>{u.email}</td><td>{u.code}</td><td><span className={`role-badge role-${u.role.replaceAll(' ','-')}`}>{u.role}</span></td><td><span className={`user-status ${u.status.toLowerCase()}`}><i/>{u.status==='Active'?'Hoạt động':'Đã khóa'}</span></td><td>{u.created}</td><td>{u.last}</td><td><div className="row-actions"><button onClick={()=>setModal({mode:'edit',user:u})}><Pencil size={15}/></button><button title={u.status==='Active'?'Khóa':'Mở khóa'} onClick={()=>setUsers(v=>v.map(x=>x.id===u.id?{...x,status:x.status==='Active'?'Locked':'Active'}:x))}>{u.status==='Active'?<ShieldCheck size={15}/>:<Check size={15}/>}</button><button className="danger-icon" onClick={()=>setUsers(v=>v.filter(x=>x.id!==u.id))}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div></div></>:<PermissionMatrix/>}</main></section>{modal&&<UserDialog initial={modal.user} onClose={()=>setModal(null)} onSave={u=>{setUsers(v=>modal.mode==='edit'?v.map(x=>x.id===u.id?u:x):[{...u,id:Date.now(),created:'10/10/2026',last:'Chưa đăng nhập'},...v]);setModal(null)}}/>}</div>
}

function UserDialog({initial,onClose,onSave}){const [form,setForm]=useState(initial||{name:'',email:'',code:'',role:'Sinh viên',phone:'',status:'Active'});const update=(k,v)=>setForm(x=>({...x,[k]:v}));return <div className="modal-backdrop"><div className="user-dialog"><div className="editor-header"><div><span className="label">TÀI KHOẢN HỆ THỐNG</span><h2>{initial?'Chỉnh sửa người dùng':'Thêm người dùng'}</h2></div><button onClick={onClose}><X size={20}/></button></div><div className="editor-body"><div className="editor-grid"><label>Họ tên<input value={form.name} onChange={e=>update('name',e.target.value)}/></label><label>Email<input value={form.email} onChange={e=>update('email',e.target.value)}/></label><label>Mã SV/CBGV<input value={form.code} onChange={e=>update('code',e.target.value)}/></label><label>Số điện thoại<input value={form.phone||''} onChange={e=>update('phone',e.target.value)}/></label><label>Vai trò<select value={form.role} onChange={e=>update('role',e.target.value)}><option>Admin</option><option>Cán bộ xử lý</option><option>Sinh viên</option><option>CBGV</option></select></label><label>Đơn vị / Khoa<select><option>Phòng Đào tạo</option><option>Phòng Tổ chức Cán bộ</option><option>Khoa Kinh tế</option><option>Phòng KHTC</option></select></label></div><div className="user-toggle-row"><span>Trạng thái tài khoản</span><button className={form.status==='Active'?'status-toggle on':'status-toggle'} onClick={()=>update('status',form.status==='Active'?'Locked':'Active')}><span/></button><b>{form.status==='Active'?'Hoạt động':'Đã khóa'}</b></div>{initial&&<button className="reset-password">↻ Đặt lại mật khẩu</button>}</div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-primary-btn" onClick={()=>onSave({...form,name:form.name||'Người dùng mới'})}><Save size={15}/> Lưu người dùng</button></div></div></div>}

function PermissionMatrix(){const rows=['Admin','Cán bộ xử lý','Sinh viên','CBGV'],cols=['Quản lý TTHC','Quản lý hồ sơ','Quản lý KB','Quản lý users','Xem báo cáo','Xử lý hồ sơ'];return <div className="permission-card"><div className="table-toolbar"><span>Ma trận phân quyền</span><small>Quyền truy cập theo vai trò</small></div><table className="permission-table"><thead><tr><th>VAI TRÒ</th>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={r}><td><b>{r}</b></td>{cols.map((c,j)=><td key={c}><input type="checkbox" defaultChecked={i===0||j<=(i===1?4:i===3?1:0)}/></td>)}</tr>)}</tbody></table></div>}

const faqSeed=['Làm thế nào để nộp hồ sơ trực tuyến?','Hồ sơ xác nhận sinh viên gồm những giấy tờ gì?','Thời gian xử lý hồ sơ là bao lâu?','Tôi có thể theo dõi hồ sơ bằng cách nào?','Làm sao để tải biểu mẫu hành chính?','Quên mật khẩu tài khoản phải làm gì?','Đơn xin nghỉ phép cần được gửi cho ai?','Hồ sơ bị yêu cầu bổ sung thì xử lý thế nào?','Tôi có thể liên hệ Bộ phận Một cửa qua đâu?','AI Chatbot có thể hỗ trợ những nội dung gì?'].map((q,i)=>({id:i,question:q,category:['Thủ tục chung','Sinh viên','Thủ tục chung','Kỹ thuật','CBGV'][i%5],views:1240-i*73,active:i!==8,answer:'Bạn có thể thực hiện theo hướng dẫn trên Cổng dịch vụ hành chính trực tuyến của Trường Đại học Thái Bình. Vui lòng chuẩn bị đầy đủ hồ sơ và theo dõi thông báo xử lý.'}));
function AdminFaq(){const [faqs,setFaqs]=useState(faqSeed),[cat,setCat]=useState('Tất cả'),[open,setOpen]=useState(null),[modal,setModal]=useState(null);const filtered=faqs.filter(x=>cat==='Tất cả'||x.category===cat);return <div className="admin-shell"><AdminSideRail active="FAQ"/><section className="admin-main"><AdminTopbar title="FAQ"/><main className="admin-content faq-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>AI & Nội dung</span><ArrowRight size={13}/><b>FAQ</b></div><h1>Quản lý FAQ</h1><p>Quản lý các câu hỏi thường gặp và câu trả lời cho người dùng.</p></div><button className="admin-primary-btn" onClick={()=>setModal({})}><Plus size={16}/> Thêm câu hỏi</button></div><div className="kb-tabs faq-tabs">{['Tất cả','Thủ tục chung','Sinh viên','CBGV','Kỹ thuật'].map(x=><button className={cat===x?'selected':''} onClick={()=>setCat(x)} key={x}>{x}</button>)}</div><div className="faq-list">{filtered.map(item=><div className="faq-item" key={item.id}><GripVertical className="faq-grip" size={17}/><div className="faq-main"><div className="faq-question" onClick={()=>setOpen(open===item.id?null:item.id)}><b>{item.question}</b><span className="audience-tag">{item.category}</span><small>{item.views.toLocaleString('vi-VN')} lượt xem</small><ChevronDown size={15}/></div>{open===item.id&&<p className="faq-answer">{item.answer}</p>}</div><button className={item.active?'status-toggle on':'status-toggle'} onClick={()=>setFaqs(v=>v.map(x=>x.id===item.id?{...x,active:!x.active}:x))}><span/></button><span className="faq-visible">{item.active?'Hiển thị':'Ẩn'}</span><div className="row-actions"><button onClick={()=>setModal(item)}><Pencil size={15}/></button><button className="danger-icon" onClick={()=>setFaqs(v=>v.filter(x=>x.id!==item.id))}><Trash2 size={15}/></button></div></div>)}</div></main></section>{modal&&<FaqDialog initial={modal.question?modal:null} onClose={()=>setModal(null)} onSave={item=>{setFaqs(v=>modal.question?v.map(x=>x.id===item.id?item:x):[{...item,id:Date.now(),views:0},...v]);setModal(null)}}/>}</div>}
function FaqDialog({initial,onClose,onSave}){const [form,setForm]=useState(initial||{question:'',answer:'',category:'Thủ tục chung',active:true});const u=(k,v)=>setForm(x=>({...x,[k]:v}));return <div className="modal-backdrop"><div className="faq-dialog"><div className="editor-header"><div><span className="label">NỘI DUNG TRỢ GIÚP</span><h2>{initial?'Chỉnh sửa câu hỏi':'Thêm câu hỏi'}</h2></div><button onClick={onClose}><X size={20}/></button></div><div className="editor-body"><label className="full-field">Câu hỏi<input value={form.question} onChange={e=>u('question',e.target.value)} placeholder="Nhập câu hỏi thường gặp..."/></label><label className="full-field">Trả lời<div className="rich-editor"><div><b>B</b><i>I</i><span>• Danh sách</span><span>🔗 Liên kết</span></div><textarea rows="7" value={form.answer} onChange={e=>u('answer',e.target.value)} placeholder="Nhập nội dung trả lời..."/></div></label><div className="editor-grid"><label>Danh mục<select value={form.category} onChange={e=>u('category',e.target.value)}><option>Thủ tục chung</option><option>Sinh viên</option><option>CBGV</option><option>Kỹ thuật</option></select></label><label>Thứ tự hiển thị<input type="number" defaultValue="1"/></label></div><div className="user-toggle-row"><span>Trạng thái hiển thị</span><button className={form.active?'status-toggle on':'status-toggle'} onClick={()=>u('active',!form.active)}><span/></button><b>{form.active?'Hiển thị':'Ẩn'}</b></div></div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-primary-btn" onClick={()=>onSave({...form,question:form.question||'Câu hỏi mới'})}><Save size={15}/> Lưu câu hỏi</button></div></div></div>}

const newsSeed=[['Triển khai cổng dịch vụ hành chính trực tuyến phiên bản mới','Thông báo','Nguyễn Văn Admin','08/10/2026','2,345','Published'],['Hướng dẫn cập nhật thông tin tài khoản người dùng','Hướng dẫn','Trần Minh Đức','02/10/2026','1,876','Published'],['Lịch tiếp nhận hồ sơ trực tiếp tại Bộ phận Một cửa','Thông báo','Lê Thu Hà','25/09/2026','1,204','Published'],['Khai giảng năm học mới 2026-2027','Tin tức','Phòng Truyền thông','15/09/2026','3,421','Published'],['Thông báo lịch nghỉ lễ Quốc khánh','Thông báo','Nguyễn Văn Admin','01/09/2026','987','Draft']].map((n,i)=>({id:i,title:n[0],category:n[1],author:n[2],date:n[3],views:n[4],status:n[5]}));
function AdminNews(){const [articles,setArticles]=useState(newsSeed),[query,setQuery]=useState(''),[category,setCategory]=useState(''),[status,setStatus]=useState(''),[editor,setEditor]=useState(null);const filtered=articles.filter(x=>(!query||x.title.toLowerCase().includes(query.toLowerCase()))&&(!category||x.category===category)&&(!status||x.status===status));return <div className="admin-shell"><AdminSideRail active="Tin tức"/><section className="admin-main"><AdminTopbar title="Tin tức"/><main className="admin-content news-admin-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>AI & Nội dung</span><ArrowRight size={13}/><b>Tin tức</b></div><h1>Quản lý Tin tức & Thông báo</h1><p>Xuất bản thông tin và hướng dẫn mới nhất đến sinh viên, cán bộ.</p></div><button className="admin-primary-btn" onClick={()=>setEditor({})}><Plus size={16}/> Viết bài mới</button></div><div className="procedure-filter-bar"><div className="admin-filter-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm kiếm bài viết..."/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Tất cả danh mục</option><option>Thông báo</option><option>Tin tức</option><option>Hướng dẫn</option></select><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Tất cả trạng thái</option><option>Published</option><option>Draft</option></select></div><div className="procedures-table-card"><div className="table-toolbar"><span>Danh sách bài viết <b>{filtered.length}</b></span><small>5 bài viết</small></div><div className="admin-table-scroll"><table className="procedures-table news-table"><thead><tr><th>ẢNH</th><th>TIÊU ĐỀ</th><th>DANH MỤC</th><th>TÁC GIẢ</th><th>NGÀY ĐĂNG</th><th>LƯỢT XEM</th><th>TRẠNG THÁI</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{filtered.map(a=><tr key={a.id}><td><div className="news-thumb"><Newspaper size={16}/></div></td><td><strong className="procedure-name">{a.title}</strong></td><td><span className="audience-tag">{a.category}</span></td><td>{a.author}</td><td>{a.date}</td><td>{a.views}</td><td><span className={`news-status ${a.status.toLowerCase()}`}>{a.status==='Published'?'Đã đăng':'Bản nháp'}</span></td><td><div className="row-actions"><button onClick={()=>setEditor(a)}><Pencil size={15}/></button><button className="danger-icon" onClick={()=>setArticles(v=>v.filter(x=>x.id!==a.id))}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div></div></main></section>{editor&&<NewsEditor initial={editor} onClose={()=>setEditor(null)} onSave={item=>{setArticles(v=>editor.id?v.map(x=>x.id===item.id?item:x):[{...item,id:Date.now(),date:'10/10/2026',views:'0'},...v]);setEditor(null)}}/>}</div>}
function NewsEditor({initial,onClose,onSave}){const [title,setTitle]=useState(initial.title||''),[cat,setCat]=useState(initial.category||'Thông báo'),[published,setPublished]=useState(initial.status==='Published');return <div className="news-editor-page"><div className="news-editor-top"><button className="admin-outline-btn" onClick={onClose}>← Quay lại</button><span>Soạn thảo bài viết</span><div><button className="admin-outline-btn" onClick={()=>onSave({...(initial.id?initial:{}),title:title||'Bài viết mới',category:cat,author:'Nguyễn Văn Admin',status:'Draft'})}>Lưu nháp</button><button className="admin-primary-btn" onClick={()=>onSave({...(initial.id?initial:{}),title:title||'Bài viết mới',category:cat,author:'Nguyễn Văn Admin',status:'Published'})}>Đăng bài</button></div></div><div className="news-editor-layout"><main><input className="news-title-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Tiêu đề bài viết..."/><div className="news-editor-toolbar"><b>B</b><i>I</i><span>H1</span><span>H2</span><span>• Danh sách</span><span>1. Danh sách</span><span>🔗</span><span>🖼</span><span>▦</span></div><textarea className="news-body-editor" placeholder="Bắt đầu viết nội dung bài viết..." defaultValue="Nội dung bài viết sẽ được hiển thị tại đây. Hãy nhập thông tin chi tiết về thông báo hoặc tin tức của trường."/><div className="seo-box"><h3>SEO</h3><label>Meta title<input defaultValue={title}/></label><label>Meta description<textarea rows="3" placeholder="Mô tả ngắn cho công cụ tìm kiếm..."/></label><label>Tags<input placeholder="Nhập tag và nhấn Enter..."/></label></div></main><aside className="news-editor-sidebar"><h3>Thông tin bài viết</h3><label>Danh mục<select value={cat} onChange={e=>setCat(e.target.value)}><option>Thông báo</option><option>Tin tức</option><option>Hướng dẫn</option></select></label><label>Ảnh đại diện<div className="featured-upload"><UploadCloud size={22}/><span>Tải ảnh lên</span><small>PNG, JPG · 1200×630px</small></div></label><label>Trạng thái<div className="publish-status"><button className={published?'selected':''} onClick={()=>setPublished(true)}>Published</button><button className={!published?'selected':''} onClick={()=>setPublished(false)}>Draft</button></div></label><label>Ngày đăng<input type="date" defaultValue="2026-10-10"/></label><label>Tác giả<select><option>Nguyễn Văn Admin</option><option>Phòng Truyền thông</option></select></label></aside></div></div>}

const applicationStatuses = ['Tiếp nhận', 'Đang xử lý', 'Chờ bổ sung', 'Hoàn thành', 'Trả kết quả'];
const applicationSeed = [
  ['HS-2026-001234','Nguyễn Lan Anh','Đăng ký xác nhận sinh viên','08/10/2026','blue','NL','1 ngày','Phòng Đào tạo'],
  ['HS-2026-001229','Trần Minh Đức','Thanh toán công tác phí','08/10/2026','yellow','MD','2 ngày','Phòng KHTC'],
  ['HS-2026-001228','Lê Thu Hà','Cấp giấy xác nhận công tác','07/10/2026','green','TH','3 ngày','Phòng TCCB'],
  ['HS-2026-001225','Phạm Hoàng Nam','Đề xuất nhiệm vụ KHCN','07/10/2026','red','PN','5 ngày','Phòng KHCN'],
  ['HS-2026-001221','Đỗ Ngọc Mai','Cấp lại thẻ sinh viên','06/10/2026','green','NM','4 ngày','Phòng Đào tạo'],
  ['HS-2026-001218','Vũ Quang Huy','Đăng ký sử dụng phòng học','06/10/2026','yellow','QH','2 ngày','Văn phòng'],
  ['HS-2026-001214','Nguyễn Thị Hương','Đơn xin nghỉ phép năm','05/10/2026','green','TH','6 ngày','Phòng TCCB'],
  ['HS-2026-001209','Bùi Gia Bảo','Đăng ký xác nhận sinh viên','04/10/2026','blue','GB','7 ngày','Phòng Đào tạo'],
  ['HS-2026-001205','Hoàng Minh Tuấn','Đơn xin nghỉ ốm / thai sản','04/10/2026','red','MT','8 ngày','Phòng TCCB'],
  ['HS-2026-001201','Lê Thùy Linh','Đăng ký học lại / cải thiện điểm','03/10/2026','yellow','TL','9 ngày','Phòng Đào tạo'],
  ['HS-2026-001198','Đặng Văn Long','Cấp giấy xác nhận công tác','02/10/2026','green','VL','10 ngày','Phòng TCCB'],
  ['HS-2026-001192','Phan Ngọc Ánh','Đơn xin chuyển công tác','01/10/2026','blue','NA','11 ngày','Phòng TCCB'],
  ['HS-2026-001187','Nguyễn Đức Anh','Thanh toán công tác phí','30/09/2026','yellow','DA','12 ngày','Phòng KHTC'],
  ['HS-2026-001181','Trần Thị Mai','Đề xuất nhiệm vụ KHCN','29/09/2026','green','TM','13 ngày','Phòng KHCN'],
  ['HS-2026-001175','Lương Quốc Việt','Ký kết hợp đồng lao động','28/09/2026','red','QV','14 ngày','Phòng TCCB'],
  ['HS-2026-001169','Nguyễn Hà My','Cấp lại thẻ sinh viên','27/09/2026','green','HM','15 ngày','Phòng Đào tạo'],
  ['HS-2026-001164','Phạm Ngọc Sơn','Đăng ký sử dụng phòng học','26/09/2026','yellow','NS','16 ngày','Văn phòng'],
  ['HS-2026-001158','Đỗ Thanh Tâm','Đăng ký xác nhận sinh viên','25/09/2026','blue','TT','17 ngày','Phòng Đào tạo'],
  ['HS-2026-001151','Mai Hoàng Yến','Đơn xin nghỉ phép năm','24/09/2026','green','HY','18 ngày','Phòng TCCB'],
  ['HS-2026-001147','Nguyễn Văn Dũng','Thanh toán tiền lương và phụ cấp','23/09/2026','red','VD','19 ngày','Phòng KHTC'],
  ['HS-2026-001141','Trịnh Minh Châu','Cấp giấy xác nhận công tác','22/09/2026','yellow','MC','20 ngày','Phòng TCCB'],
  ['HS-2026-001136','Hà Đức Thành','Đăng ký học lại / cải thiện điểm','21/09/2026','green','DT','21 ngày','Phòng Đào tạo']
].map((item, index) => ({ code:item[0], applicant:item[1], procedure:item[2], date:item[3], priority:item[4], staff:item[5], elapsed:item[6], dept:item[7], status:applicationStatuses[index % applicationStatuses.length] }));

function AdminApplications() {
  const { applications, setApplications, addNotification } = useDataStore();
  const [view, setView] = useState('kanban');
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('');
  const [procedure, setProcedure] = useState('');
  const [selected, setSelected] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [dragged, setDragged] = useState(null);
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) setSelected(applications.find(item => item.code === code) || null);
  }, [applications]);
  const filtered = applications.filter(item => (!query || `${item.code} ${item.applicant}`.toLowerCase().includes(query.toLowerCase())) && (!dept || item.dept === dept) && (!procedure || item.procedure === procedure));
  const moveApplication = (code, status) => setApplications(value => value.map(item => {
    if (item.code !== code) return item;
    addNotification({ audience: item.email || item.applicant, type: 'application-status', text: `Hồ sơ ${code} của bạn đã chuyển sang trạng thái: ${status}`, code });
    return {...item, status, updatedAt: new Date().toISOString(), timeline: [...(item.timeline || []), { status, at: new Date().toISOString(), by: 'Cán bộ xử lý', note: item.note || '' }]};
  }));
  const saveNote = (code, entry) => {
    setApplications(value => value.map(item => item.code === code
      ? { ...item, notes: [entry, ...(item.notes || [])], timeline: [...(item.timeline || []), { status: item.status, at: new Date().toISOString(), by: entry.by, note: entry.text }] }
      : item));
    addNotification({ audience: selected?.email || selected?.applicant, type: 'application-note', text: `Cán bộ đã ghi chú hồ sơ ${code}`, code });
  };
  return <div className="admin-shell"><AdminSideRail active="Hồ sơ / Yêu cầu" /><section className="admin-main"><AdminTopbar title="Hồ sơ / Yêu cầu" /><main className="admin-content applications-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>Quản lý hồ sơ</span><ArrowRight size={13}/><b>Hồ sơ / Yêu cầu</b></div><h1>Quản lý Hồ sơ</h1><p>Tiếp nhận, phân công và theo dõi tiến độ xử lý hồ sơ.</p></div><div className="view-toggle"><button className={view==='kanban'?'selected':''} onClick={()=>setView('kanban')}><GitBranch size={15}/> Kanban</button><button className={view==='table'?'selected':''} onClick={()=>setView('table')}><FileText size={15}/> Bảng</button><button className="admin-outline-btn" onClick={() => downloadCsv(`ho-so-${new Date().toISOString().slice(0,10)}.csv`, applicationCsvRows(filtered))}><Download size={14}/> Xuất Excel</button></div></div><div className="application-filter-bar"><div className="admin-filter-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm mã hồ sơ hoặc tên người nộp..."/></div><input className="date-filter" type="date" aria-label="Từ ngày"/><span className="date-separator">—</span><input className="date-filter" type="date" aria-label="Đến ngày"/><select value={dept} onChange={e=>setDept(e.target.value)}><option value="">Tất cả phòng ban</option>{['Phòng Đào tạo','Phòng TCCB','Phòng KHTC','Phòng KHCN','Văn phòng'].map(x=><option key={x}>{x}</option>)}</select><select value={procedure} onChange={e=>setProcedure(e.target.value)}><option value="">Tất cả thủ tục</option>{[...new Set(applications.map(x=>x.procedure))].map(x=><option key={x}>{x}</option>)}</select></div>{view==='kanban' ? <div className="kanban-board">{applicationStatuses.map(status => <div className={`kanban-column column-${applicationStatuses.indexOf(status)}`} key={status} onDragOver={e=>e.preventDefault()} onDrop={()=>dragged && (moveApplication(dragged,status),setDragged(null))}><div className="kanban-heading"><div><span className="kanban-dot"/><b>{status}</b></div><span className="kanban-count">{filtered.filter(item=>item.status===status).length}</span></div><div className="kanban-cards">{filtered.filter(item=>item.status===status).map(item=><ApplicationCard key={item.code} item={item} onDrag={()=>setDragged(item.code)} onClick={()=>setSelected(item)}/>)}</div><button className="add-application">+ Thêm hồ sơ</button></div>)}</div> : <ApplicationTable applications={filtered} onSelect={setSelected}/>}</main></section>{selected && <ApplicationDetail item={selected} onClose={()=>setSelected(null)} onStatus={(status)=>{moveApplication(selected.code,status);setSelected({...selected,status})}} onNote={entry=>saveNote(selected.code, entry)} onReceipt={()=>setReceipt(selected)}/>} {receipt && <ReceiptModal item={receipt} onClose={()=>setReceipt(null)}/>}</div>;
}

function ApplicationCard({item,onDrag,onClick}) {
  return <article className="application-card" draggable onDragStart={onDrag} onClick={onClick}><div className="application-card-top"><b>{item.code}</b><span className={`priority-dot ${item.priority}`} title="Mức độ ưu tiên"/></div><h3>{item.applicant}</h3><p>{item.procedure}</p><div className="application-card-footer"><span>{item.date}</span><span className={`elapsed-badge ${item.priority==='red'?'overdue':''}`}>{item.elapsed}</span><span className="staff-avatar">{item.staff}</span></div></article>;
}

function ApplicationTable({applications,onSelect}) {
  return <div className="application-table-wrap"><table className="application-management-table"><thead><tr><th>MÃ HS</th><th>NGƯỜI NỘP</th><th>THỦ TỤC</th><th>NGÀY NỘP</th><th>TRẠNG THÁI</th><th>CÁN BỘ XỬ LÝ</th><th>NGÀY DỰ KIẾN</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{applications.map(item=><tr key={item.code} onClick={()=>onSelect(item)}><td><b>{item.code}</b></td><td>{item.applicant}</td><td>{item.procedure}</td><td>{item.date}</td><td><span className={`application-status status-${applicationStatuses.indexOf(item.status)}`}>{item.status}</span></td><td><span className="staff-avatar">{item.staff}</span> Cán bộ {item.staff}</td><td>12/10/2026</td><td><button className="table-action">Xem</button></td></tr>)}</tbody></table></div>;
}

function ApplicationDetail({item,onClose,onStatus,onNote,onReceipt}) {
  const [noteMode,setNoteMode] = useState('');
  const [note,setNote] = useState('');
  const [notes,setNotes] = useState(item.notes || [{text:'Đã kiểm tra hồ sơ, thông tin đầy đủ.',by:'Nguyễn Minh Đức',time:'08/10/2026 · 10:05'}]);
  const addNote=()=>{if(note.trim()){const entry={text:note,by:'Admin',time:'Vừa xong'};setNotes(value=>[entry,...value]);onNote?.(entry);setNote('');setNoteMode('');}};
  return <div className="application-detail-backdrop"><aside className="application-detail"><div className="detail-header"><div><small>MÃ HỒ SƠ</small><h2>{item.code}</h2><span className={`application-status status-${applicationStatuses.indexOf(item.status)}`}>{item.status}</span></div><button onClick={onClose}><X size={19}/></button></div><div className="detail-scroll"><DetailSection title="Thông tin người nộp"><div className="applicant-profile"><span className="large-avatar">{item.staff}</span><div><b>{item.applicant}</b><small>21D100123 · Sinh viên</small></div></div><div className="detail-info-grid"><span>Email<b>lananh@tbu.edu.vn</b></span><span>Số điện thoại<b>0988 123 456</b></span><span>Đơn vị / Khoa<b>Khoa Kinh tế</b></span><span>Ngày nộp<b>{item.date}</b></span></div></DetailSection><DetailSection title="Thông tin thủ tục"><div className="procedure-summary"><FileText size={19}/><div><b>{item.procedure}</b><small>{item.dept} · Xử lý trong 3-5 ngày</small></div></div></DetailSection><DetailSection title="Hồ sơ đính kèm"><div className="attached-file"><FileText size={17}/><span><b>don-de-nghi-xac-nhan.pdf</b><small>245 KB · Đã tải lên 08/10/2026</small></span><button>↓</button><button>⌕</button></div><div className="attached-file"><FileText size={17}/><span><b>the-sinh-vien.jpg</b><small>1.2 MB · Đã tải lên 08/10/2026</small></span><button>↓</button><button>⌕</button></div></DetailSection><DetailSection title="Tiến trình xử lý"><div className="detail-timeline">{['Đã tiếp nhận','Đang xử lý','Chờ bổ sung','Hoàn thành'].map((status,index)=><div className={index<=applicationStatuses.indexOf(item.status)?'detail-timeline-item done':'detail-timeline-item'} key={status}><i/ ><div><b>{status}</b><small>{index<2?'08/10/2026 · '+(index?'10:05':'09:12'):'Dự kiến cập nhật'}</small><p>{index===0?'Hồ sơ được tiếp nhận trên cổng trực tuyến.':index===1?'Phòng chuyên môn đang kiểm tra và xử lý.':''}</p></div></div>)}</div></DetailSection><DetailSection title="Thao tác xử lý"><div className="detail-actions"><label>Chuyển trạng thái<select value={item.status} onChange={e=>onStatus(e.target.value)}>{applicationStatuses.map(x=><option key={x}>{x}</option>)}</select></label><label>Giao cho<select defaultValue="Nguyễn Minh Đức"><option>Nguyễn Minh Đức</option><option>Trần Thu Hà</option><option>Lê Quang Huy</option></select></label><div className="detail-action-buttons"><button onClick={()=>setNoteMode('supplement')}>Yêu cầu bổ sung</button><button onClick={()=>setNoteMode('note')}>Ghi chú xử lý</button>  <button onClick={onReceipt}>In phiếu hẹn trả kết quả</button></div>{noteMode && <div className="note-composer"><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={noteMode==='supplement'?'Nhập nội dung cần bổ sung...':'Nhập ghi chú nội bộ...'} /><button onClick={addNote}>Lưu ghi chú</button></div>}</div></DetailSection><DetailSection title="Ghi chú nội bộ"><div className="internal-notes">{notes.map((entry,index)=><div key={index}><span className="staff-avatar">AD</span><p>{entry.text}<small>{entry.by} · {entry.time}</small></p></div>)}</div><div className="quick-note"><input value={noteMode?'':note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNote()} placeholder="Thêm ghi chú nhanh..."/><button onClick={addNote}><Send size={14}/></button></div></DetailSection></div></aside></div>;
}

function DetailSection({title,children}) { return <section className="detail-section"><h3>{title}</h3>{children}</section>; }

const formSeed = [
  ['BM-TCCB-01','Đơn xin nghỉ phép năm','Nghỉ phép','TCCB','v2.0','PDF','248 KB','128','08/10/2026'],
  ['BM-TCCB-02','Đơn xin nghỉ ốm / thai sản','Nghỉ phép','TCCB','v1.2','DOC','186 KB','96','07/10/2026'],
  ['BM-TCCB-03','Đơn xin chuyển ngạch','HĐLĐ','TCCB','v1.0','DOC','162 KB','74','05/10/2026'],
  ['BM-TCCB-04','Phiếu đánh giá kết quả thử việc','HĐLĐ','TCCB','v2.0','PDF','315 KB','58','02/10/2026'],
  ['BM-TCCB-05','Đề nghị ký hợp đồng lao động','HĐLĐ','TCCB','v1.1','DOC','204 KB','112','30/09/2026'],
  ['BM-KHTC-01','Giấy đề nghị thanh toán công tác phí','Lương','KHTC','v2.0','PDF','420 KB','87','28/09/2026'],
  ['BM-KHTC-02','Bảng kê chi phí công tác','Lương','KHTC','v1.0','XLS','128 KB','45','26/09/2026'],
  ['BM-KHTC-03','Phiếu đề nghị tạm ứng','Lương','KHTC','v1.0','DOC','98 KB','39','20/09/2026'],
  ['BM-ĐT-01','Đơn đăng ký học lại / cải thiện điểm','Đào tạo','Đào tạo','v2.1','PDF','275 KB','241','18/09/2026'],
  ['BM-ĐT-02','Đơn xin cấp lại thẻ sinh viên','Đào tạo','Đào tạo','v1.0','DOC','155 KB','198','15/09/2026'],
  ['BM-ĐT-03','Phiếu đăng ký sử dụng phòng học','Đào tạo','Văn phòng','v1.2','PDF','232 KB','65','12/09/2026'],
  ['BM-KHCN-01','Phiếu đề xuất nhiệm vụ KHCN','Tập huấn','KHCN','v1.0','DOC','344 KB','51','09/09/2026'],
  ['BM-TCCB-06','Đơn xin chuyển công tác','Chuyển CT','TCCB','v1.0','PDF','198 KB','43','06/09/2026'],
  ['BM-TCCB-07','Phiếu đăng ký tham gia tập huấn','Tập huấn','TCCB','v2.0','DOC','120 KB','82','04/09/2026'],
  ['BM-TCCB-08','Bản cam kết thực hiện nhiệm vụ','HĐLĐ','TCCB','v1.0','PDF','210 KB','36','01/09/2026'],
  ['BM-ĐT-04','Đơn xin xác nhận sinh viên','Đào tạo','Đào tạo','v2.0','PDF','180 KB','305','28/08/2026']
].map(([code,name,category,dept,version,type,size,downloads,date]) => ({code,name,category,dept,version,type,size,downloads,date}));

function AdminForms() {
  const { forms, setForms } = useDataStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [selected, setSelected] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [history, setHistory] = useState(null);
  const filtered = forms.filter(item => (!query || `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase())) && (!category || item.category === category) && (!department || item.dept === department));
  const toggle = code => setSelected(value => value.includes(code) ? value.filter(item => item !== code) : [...value, code]);
  return <div className="admin-shell"><AdminSideRail active="Biểu mẫu" /><section className="admin-main"><AdminTopbar /><main className="admin-content procedures-admin-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>Quản lý</span><ArrowRight size={13} /><b>Biểu mẫu</b></div><h1>Quản lý Biểu mẫu</h1><p>Quản lý kho biểu mẫu và tài liệu hành chính của nhà trường.</p></div><button className="admin-primary-btn" onClick={() => setUploadOpen(true)}><UploadCloud size={16} /> Upload biểu mẫu</button></div><div className="procedure-filter-bar"><div className="admin-filter-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm theo tên biểu mẫu..." /></div><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Tất cả danh mục</option>{['Nghỉ phép','Lương','HĐLĐ','Tập huấn','Chuyển CT','Đào tạo'].map(x => <option key={x}>{x}</option>)}</select><select value={department} onChange={e => setDepartment(e.target.value)}><option value="">Tất cả phòng ban</option>{['TCCB','KHTC','KHCN','Đào tạo','Văn phòng'].map(x => <option key={x}>{x}</option>)}</select><button className="reset-filter" onClick={() => {setQuery('');setCategory('');setDepartment('');}}>Đặt lại</button></div>{selected.length > 0 && <div className="bulk-toolbar"><span><b>{selected.length}</b> biểu mẫu đã chọn</span><button className="bulk-delete" onClick={() => {setForms(value => value.filter(item => !selected.includes(item.code)));setSelected([]);}}><Trash2 size={15}/> Xóa đã chọn</button></div>}<div className="procedures-table-card"><div className="table-toolbar"><span>Danh sách biểu mẫu <b>{filtered.length}</b></span><small>Hiển thị 1-{filtered.length} trong tổng số {forms.length} biểu mẫu</small></div><div className="admin-table-scroll"><table className="procedures-table forms-table"><thead><tr><th>□</th><th>FILE</th><th>TÊN BIỂU MẪU</th><th>DANH MỤC</th><th>PHÒNG BAN</th><th>PHIÊN BẢN</th><th>ĐỊNH DẠNG</th><th>KÍCH THƯỚC</th><th>LƯỢT TẢI</th><th>CẬP NHẬT</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{filtered.map(item => <tr key={item.code}><td><input type="checkbox" checked={selected.includes(item.code)} onChange={() => toggle(item.code)}/></td><td><span className={`file-type ${item.type.toLowerCase()}`}><FileText size={17}/></span></td><td><strong className="procedure-name">{item.name}</strong><small className="table-dept-full">{item.code}</small></td><td><span className="audience-tag">{item.category}</span></td><td>{item.dept}</td><td><b className="version-badge">{item.version}</b></td><td><b className={`format-badge ${item.type.toLowerCase()}`}>{item.type}</b></td><td>{item.size}</td><td>{item.downloads}</td><td>{item.date}</td><td><div className="row-actions"><button title="Tải xuống"><DownloadIcon /></button><button title="Lịch sử phiên bản" onClick={() => setHistory(item)}><HistoryIcon /></button><button title="Xóa" className="danger-icon" onClick={() => setForms(value => value.filter(row => row.code !== item.code))}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div><div className="pagination"><span>Hiển thị <b>1-{filtered.length}</b> trong <b>{forms.length}</b> biểu mẫu</span><div><button className="current-page">1</button><button>2</button><button>3</button><button>›</button></div></div></div></main></section>{uploadOpen && <UploadDialog onClose={() => setUploadOpen(false)} onUpload={items => {setForms(value => [...items, ...value]);setUploadOpen(false);}}/>}{history && <VersionHistory item={history} onClose={() => setHistory(null)}/>}</div>;
}

const DownloadIcon = () => <span className="inline-icon">↓</span>;
const HistoryIcon = () => <span className="inline-icon">↺</span>;

function UploadDialog({ onClose, onUpload }) {
  const [files, setFiles] = useState([{name:'mau-bieu-moi.pdf', category:'Nghỉ phép', dept:'TCCB', version:'v1.0'}]);
  const update = (index,key,value) => setFiles(value => value.map((item,i) => i === index ? {...item,[key]:value} : item));
  return <div className="modal-backdrop"><div className="upload-dialog"><div className="editor-header"><div><span className="label">KHO BIỂU MẪU</span><h2>Upload biểu mẫu</h2><p>Thêm một hoặc nhiều biểu mẫu vào hệ thống.</p></div><button onClick={onClose}><X size={20}/></button></div><div className="upload-body"><div className="drop-zone admin-drop"><UploadCloud size={28}/><b>Kéo thả tệp vào đây hoặc <span>chọn tệp</span></b><small>PDF, DOC, DOCX, XLS · Tối đa 20MB/tệp</small></div>{files.map((file,index)=><div className="upload-file" key={index}><span className="file-type pdf"><FileText size={17}/></span><div className="upload-file-main"><b>{file.name}</b><div className="upload-progress"><span style={{width:'72%'}}/></div><small>Đang tải lên · 72%</small></div><button onClick={() => setFiles(value => value.filter((_,i)=>i!==index))}><X size={15}/></button><div className="upload-fields"><label>Tên hiển thị<input value={file.name} onChange={e=>update(index,'name',e.target.value)}/></label><label>Danh mục<select value={file.category} onChange={e=>update(index,'category',e.target.value)}><option>Nghỉ phép</option><option>Lương</option><option>HĐLĐ</option><option>Tập huấn</option><option>Chuyển CT</option></select></label><label>Phòng ban<select value={file.dept} onChange={e=>update(index,'dept',e.target.value)}><option>TCCB</option><option>KHTC</option><option>KHCN</option><option>Đào tạo</option></select></label><label>Phiên bản<input value={file.version} onChange={e=>update(index,'version',e.target.value)}/></label></div></div>)}</div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-primary-btn" onClick={() => onUpload(files.map((file,index)=>({code:`BM-NEW-0${index+1}`,name:file.name,category:file.category,dept:file.dept,version:file.version,type:'PDF',size:'1.2 MB',downloads:'0',date:'10/10/2026'})))}><UploadCloud size={15}/> Upload</button></div></div></div>;
}

function VersionHistory({item,onClose}) {
  return <div className="modal-backdrop"><div className="history-dialog"><div className="editor-header"><div><span className="label">LỊCH SỬ CẬP NHẬT</span><h2>{item.name}</h2><p>Các phiên bản đã phát hành của biểu mẫu.</p></div><button onClick={onClose}><X size={20}/></button></div><div className="history-list">{[['v2.0','08/10/2026','Nguyễn Văn Admin','128 lượt tải'],['v1.2','15/06/2026','Trần Minh Đức','86 lượt tải'],['v1.0','02/01/2026','Nguyễn Văn Admin','42 lượt tải']].map(row=><div className="history-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}<small>{row[2]}</small></span><span>{row[3]}</span><button className="download-link">Tải xuống ↓</button></div>)}</div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Đóng</button></div></div></div>;
}

const processSeed = [
  {name:'Quy trình nghỉ phép năm',dept:'Phòng Tổ chức Cán bộ',steps:4,status:'Active',date:'08/10/2026'},
  {name:'Quy trình nâng lương thường xuyên',dept:'Phòng Tổ chức Cán bộ',steps:6,status:'Active',date:'02/10/2026'},
  {name:'Quy trình tuyển dụng HĐLĐ',dept:'Phòng Tổ chức Cán bộ',steps:7,status:'Draft',date:'28/09/2026'},
  {name:'Quy trình thanh toán công tác phí',dept:'Phòng Kế hoạch - Tài chính',steps:5,status:'Active',date:'25/09/2026'},
  {name:'Quy trình đăng ký đề tài KHCN',dept:'Phòng KHCN & HTPT',steps:8,status:'Draft',date:'20/09/2026'}
];

function AdminProcesses() {
  const [processes,setProcesses] = useState(processSeed);
  const [editor,setEditor] = useState(null);
  return <div className="admin-shell"><AdminSideRail active="Quy trình"/><section className="admin-main"><AdminTopbar/><main className="admin-content procedures-admin-content"><div className="admin-page-heading"><div><div className="admin-breadcrumb inner-breadcrumb"><span>Quản lý thủ tục</span><ArrowRight size={13}/><b>Quy trình</b></div><h1>Quản lý Quy trình</h1><p>Xây dựng và quản lý các luồng xử lý hồ sơ hành chính.</p></div><button className="admin-primary-btn" onClick={()=>setEditor({name:'',dept:'Phòng Tổ chức Cán bộ',steps:[]})}><Plus size={17}/> Tạo quy trình</button></div><div className="process-card-grid">{processes.map(item=><div className="process-card" key={item.name}><div className="process-card-head"><span className="process-symbol"><GitBranch size={19}/></span><span className={item.status==='Active'?'process-active':'process-draft'}>{item.status==='Active'?'Đang hoạt động':'Bản nháp'}</span></div><h2>{item.name}</h2><p>{item.dept}</p><div className="process-meta"><span><GitBranch size={14}/>{item.steps} bước</span><span>Cập nhật {item.date}</span></div><div className="process-card-actions"><button onClick={()=>setEditor(item)}><Pencil size={14}/> Chỉnh sửa</button><button className="danger-icon" onClick={()=>setProcesses(value=>value.filter(row=>row.name!==item.name))}><Trash2 size={14}/></button></div></div>)}</div></main></section>{editor && <ProcessEditor initial={editor} onClose={()=>setEditor(null)} onSave={item=>{setProcesses(value=>editor.name?value.map(row=>row.name===editor.name?item:row):[item,...value]);setEditor(null)}}/>}</div>;
}

function ProcessEditor({initial,onClose,onSave}) {
  const [name,setName] = useState(initial.name);
  const [dept,setDept] = useState(initial.dept);
  const [preview,setPreview] = useState(false);
  const [steps,setSteps] = useState(initial.steps ? Array.from({length:initial.steps},(_,i)=>({name:['Tiếp nhận hồ sơ','Kiểm tra tính hợp lệ','Thẩm định nội dung','Phê duyệt kết quả','Trả kết quả','Lưu trữ hồ sơ'][i]||'Bước xử lý mới',desc:'Đơn vị phụ trách thực hiện và cập nhật trạng thái hồ sơ.',dept:initial.dept,time:'1 ngày'})) : [{name:'Tiếp nhận hồ sơ',desc:'Kiểm tra và ghi nhận hồ sơ gửi đến.',dept:initial.dept,time:'1 ngày'}]);
  const addStep = index => setSteps(value=>[...value.slice(0,index+1),{name:'Bước xử lý mới',desc:'Mô tả công việc của bước này.',dept,time:'1 ngày'},...value.slice(index+1)]);
  const updateStep=(index,key,value)=>setSteps(items=>items.map((step,i)=>i===index?{...step,[key]:value}:step));
  return <div className="modal-backdrop editor-backdrop"><div className="procedure-editor process-editor"><div className="editor-header"><div><span className="label">THIẾT KẾ QUY TRÌNH</span><h2>{initial.name?'Chỉnh sửa quy trình':'Tạo quy trình mới'}</h2><p>Kéo thả các bước để xây dựng luồng xử lý hồ sơ.</p></div><button onClick={onClose}><X size={20}/></button></div><div className="editor-body"><div className="editor-grid"><label>Tên quy trình<input value={name} onChange={e=>setName(e.target.value)} placeholder="Nhập tên quy trình"/></label><label>Phòng ban<select value={dept} onChange={e=>setDept(e.target.value)}>{procedureDepartments.map(x=><option key={x}>{x}</option>)}</select></label></div><div className="flow-toolbar"><h3>Sơ đồ quy trình</h3><button className={preview?'preview-toggle on':'preview-toggle'} onClick={()=>setPreview(!preview)}><span/> Chế độ xem trước</button></div><div className={preview?'flow-builder preview-mode':'flow-builder'}>{steps.map((step,index)=><React.Fragment key={index}><div className="flow-step"><GripVertical className="drag-handle" size={17}/><span className="flow-number">{index+1}</span><div><input value={step.name} onChange={e=>updateStep(index,'name',e.target.value)} disabled={preview}/><p>{preview?step.desc:<textarea value={step.desc} onChange={e=>updateStep(index,'desc',e.target.value)} rows="2"/>}</p><div className="flow-details"><select value={step.dept} onChange={e=>updateStep(index,'dept',e.target.value)} disabled={preview}>{procedureDepartments.map(x=><option key={x}>{x}</option>)}</select><input value={step.time} onChange={e=>updateStep(index,'time',e.target.value)} disabled={preview}/></div></div>{!preview&&<button className="delete-step" onClick={()=>setSteps(value=>value.filter((_,i)=>i!==index))}><Trash2 size={15}/></button>}</div>{index<steps.length-1&&<button className="add-flow-step" onClick={()=>addStep(index)}><span><Plus size={13}/></span> Thêm bước</button>}</React.Fragment>)}<button className="flow-add-last" onClick={()=>addStep(steps.length-1)}><Plus size={14}/> Thêm bước cuối</button></div></div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-outline-btn" onClick={()=>onSave({name:name||'Quy trình mới',dept,steps:steps.length,status:'Draft',date:'10/10/2026'})}>Lưu bản nháp</button><button className="admin-primary-btn" onClick={()=>onSave({name:name||'Quy trình mới',dept,steps:steps.length,status:'Active',date:'10/10/2026'})}><Save size={15}/> Lưu & xuất bản</button></div></div></div>;
}

function ProcedureEditor({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ? { ...initial, audience: initial.audience.split(' / ') } : { code: 'TT-NEW-001', name: '', dept: procedureDepartments[0], audience: ['Sinh viên'], time: '3 ngày', active: true });
  const [requirements, setRequirements] = useState(['Đơn đề nghị theo mẫu', 'Bản sao giấy tờ liên quan']);
  const [steps, setSteps] = useState([{ name: 'Tiếp nhận hồ sơ', desc: 'Kiểm tra tính đầy đủ của hồ sơ.', dept: procedureDepartments[0], duration: '1 ngày' }, { name: 'Thẩm định và xử lý', desc: 'Đơn vị chuyên môn xem xét nội dung.', dept: 'Phòng Đào tạo', duration: '1 ngày' }]);
  const update = (key, value) => setForm(valueForm => ({ ...valueForm, [key]: value }));
  const addStep = () => setSteps(value => [...value, { name: '', desc: '', dept: procedureDepartments[0], duration: '1 ngày' }]);
  const updateStep = (index, key, value) => setSteps(value => value.map((step, i) => i === index ? { ...step, [key]: value } : step));
  const save = () => onSave({ ...form, name: form.name || 'Thủ tục mới', steps: steps.length, audience: form.audience.join(' / '), deptShort: form.dept.includes('Đào tạo') ? 'ĐT' : 'TCCB' });
  return <div className="modal-backdrop editor-backdrop"><div className="procedure-editor"><div className="editor-header"><div><span className="label">THÔNG TIN DỊCH VỤ</span><h2>{initial ? 'Chỉnh sửa thủ tục' : 'Thêm thủ tục mới'}</h2><p>Khai báo đầy đủ thông tin để người dùng có thể thực hiện thủ tục.</p></div><button onClick={onClose}><X size={20} /></button></div><div className="editor-body"><div className="editor-grid"><label>Mã thủ tục<input value={form.code} onChange={e => update('code', e.target.value)} /></label><label>Tên thủ tục <em>*</em><input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nhập tên thủ tục" /></label><label>Phòng ban<select value={form.dept} onChange={e => update('dept', e.target.value)}>{procedureDepartments.map(item => <option key={item}>{item}</option>)}</select></label><label>Đối tượng<div className="audience-multi">{['Sinh viên', 'CBGV', 'Tất cả'].map(item => <label key={item}><input type="checkbox" checked={form.audience.includes(item)} onChange={() => update('audience', form.audience.includes(item) ? form.audience.filter(value => value !== item) : [...form.audience, item])} /> {item}</label>)}</div></label><label>Thời gian xử lý<input value={form.time} onChange={e => update('time', e.target.value)} /></label><label>Lệ phí (VNĐ)<input type="number" defaultValue="0" /></label></div><label className="full-field">Mô tả ngắn<textarea rows="2" placeholder="Mô tả ngắn gọn về thủ tục..." /></label><label className="full-field">Nội dung chi tiết<div className="rich-editor"><div><b>B</b><i>I</i><u>U</u><span>• Danh sách</span><span>1. Đánh số</span></div><textarea rows="4" placeholder="Nhập nội dung hướng dẫn chi tiết..." /></div></label><div className="editor-section-title"><h3>Hồ sơ yêu cầu</h3><button className="mini-add" onClick={() => setRequirements(value => [...value, ''])}><Plus size={14} /> Thêm tài liệu</button></div><div className="requirements-list">{requirements.map((item, index) => <div key={index}><span>{index + 1}</span><input value={item} onChange={e => setRequirements(value => value.map((req, i) => i === index ? e.target.value : req))} /><button onClick={() => setRequirements(value => value.filter((_, i) => i !== index))}><Trash2 size={14} /></button></div>)}</div><div className="editor-section-title"><div><h3>Quy trình xử lý</h3><p>Sắp xếp các bước theo đúng trình tự thực hiện.</p></div><button className="mini-add" onClick={addStep}><Plus size={14} /> Thêm bước</button></div><div className="steps-builder">{steps.map((step, index) => <div className="process-step" key={index}><GripVertical className="drag-handle" size={18} /><span className="step-number">{index + 1}</span><div className="step-fields"><input value={step.name} onChange={e => updateStep(index, 'name', e.target.value)} placeholder="Tên bước xử lý" /><textarea value={step.desc} onChange={e => updateStep(index, 'desc', e.target.value)} placeholder="Mô tả công việc..." rows="2" /><div><select value={step.dept} onChange={e => updateStep(index, 'dept', e.target.value)}>{procedureDepartments.map(item => <option key={item}>{item}</option>)}</select><input value={step.duration} onChange={e => updateStep(index, 'duration', e.target.value)} placeholder="Thời lượng" /></div></div><button className="delete-step" onClick={() => setSteps(value => value.filter((_, i) => i !== index))}><Trash2 size={16} /></button></div>)}</div></div><div className="editor-footer"><button className="admin-outline-btn" onClick={onClose}>Hủy</button><button className="admin-primary-btn" onClick={save}><Save size={15} /> Lưu thủ tục</button></div></div></div>;
}

function AdminPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark-mode'));
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);
  const goPublic = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  return <div className={collapsed ? 'admin-shell collapsed' : 'admin-shell'}>
    <aside className="admin-sidebar">
      <button className="admin-logo" onClick={goPublic}><span className="brand-mark"><Building2 size={21} /></span><span><b>ĐẠI HỌC THÁI BÌNH</b><small>QUẢN TRỊ HỆ THỐNG</small></span></button>
      <nav className="admin-nav">{adminMenu.map(group => <div className="admin-nav-group" key={group.section}><small className="admin-section">{group.section}</small>{group.items.map(([label, Icon]) => <button onClick={() => label === 'Thủ tục hành chính' ? adminNavigate('/admin/procedures') : undefined} className={label === 'Dashboard' ? 'admin-nav-item active' : 'admin-nav-item'} key={label} title={label}><Icon size={18} /><span>{label}</span></button>)}</div>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-user"><span className="admin-avatar">AD</span><span><b>Admin</b><small>Quản trị viên</small></span><MoreHorizontal size={16} /></div><button className="logout-btn" onClick={goPublic}><LogOut size={16} /><span>Đăng xuất</span></button><button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}<span>{collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}</span></button></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div className="admin-breadcrumb"><span>Trang quản trị</span><ArrowRight size={13} /><b>Dashboard</b></div><div className="admin-top-actions"><button className="admin-search" aria-label="Tìm kiếm"><Search size={17} /><span>Tìm kiếm...</span><kbd>⌘ K</kbd></button><button className="theme-toggle" aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} onClick={() => { const next = !darkMode; setDarkMode(next); document.documentElement.classList.toggle('dark-mode', next); localStorage.setItem('tbu-theme', next ? 'dark' : 'light'); }}>{darkMode ? '☀' : '◐'}</button><NotificationButton audience="admin" /><div className="admin-top-user"><span className="admin-avatar">AD</span><span><b>Admin</b><small>Quản trị viên</small></span><ChevronDown size={14} /></div></div></header>
      <main className="admin-content"><div className="admin-welcome"><div><h1>Xin chào, Admin! <span>👋</span></h1><p>Chúc bạn một ngày làm việc hiệu quả. Dưới đây là tổng quan hệ thống hôm nay.</p></div><span className="admin-date">Thứ Bảy, 10 tháng 10, 2026</span></div>
        {loading ? <AdminSkeleton /> : <><div className="kpi-grid">{[
          ['Tổng hồ sơ tháng này','156','+12% ↑ so với tháng trước',FolderOpen,'blue'],
          ['Đang xử lý','23','Cần xử lý: 5 quá hạn',Clock3,'amber'],
          ['Hoàn thành','128','Tỷ lệ: 82%',Check,'green'],
          ['Câu hỏi AI hôm nay','89','Độ hài lòng: 94%',Bot,'purple']
        ].map(([label,value,trend,Icon,color]) => <div className="kpi-card" key={label}><div className={`kpi-icon ${color}`}><Icon size={20} /></div><div className="kpi-copy"><small>{label}</small><strong>{value}</strong><span className={color === 'amber' ? 'warning-text' : 'trend-text'}>{color === 'amber' && <AlertCircle size={12} />}{trend}</span></div><TrendingUp className="kpi-trend" size={17} /></div>)}</div>
        <div className="admin-chart-grid"><AdminChartCard title="Hồ sơ theo tháng" action="12 tháng"><ResponsiveContainer width="100%" height={235}><LineChart data={monthlyApplications}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f7" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#8290a5'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#8290a5'}} /><Tooltip contentStyle={{border:'0', borderRadius:8, fontSize:11, boxShadow:'0 5px 20px #173c9120'}} /><Line type="monotone" dataKey="value" stroke="#245dcc" strokeWidth={3} dot={{r:3, fill:'#245dcc', strokeWidth:2, stroke:'#fff'}} activeDot={{r:5}} /></LineChart></ResponsiveContainer></AdminChartCard><AdminChartCard title="Phân bố theo phòng ban"><div className="donut-wrap"><ResponsiveContainer width="58%" height={215}><PieChart><Pie data={departmentsData} dataKey="value" innerRadius={61} outerRadius={82} paddingAngle={3}>{departmentsData.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{border:'0',borderRadius:8,fontSize:11}} /></PieChart></ResponsiveContainer><div className="donut-legend">{departmentsData.map(item => <div key={item.name}><i style={{background:item.color}} /><span>{item.name}</span><b>{item.value}%</b></div>)}</div></div></AdminChartCard></div>
        <div className="admin-lower-grid"><div className="admin-table-card"><div className="card-title-row"><div><h2>Hồ sơ cần xử lý</h2><p>Các hồ sơ đang chờ bạn kiểm tra</p></div><button className="view-all">Xem tất cả <ArrowRight size={14} /></button></div><div className="admin-table-scroll"><table><thead><tr><th>MÃ HS</th><th>NGƯỜI NỘP</th><th>THỦ TỤC</th><th>NGÀY NỘP</th><th>TRẠNG THÁI</th><th /></tr></thead><tbody>{pendingApplications.map(row => <tr key={row[0]}><td><b>{row[0]}</b></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><span className={`admin-status ${row[4] === 'Quá hạn' ? 'late' : row[4] === 'Chờ bổ sung' ? 'waiting' : 'processing'}`}>{row[4]}</span></td><td><button className="table-action">Xem</button></td></tr>)}</tbody></table></div></div><div className="chat-activity-card"><div className="card-title-row"><div><h2>Hoạt động Chatbot</h2><p>Tình hình tương tác hôm nay</p></div><Bot size={20} color="#7254c8" /></div><div className="chat-mini-stats"><div><strong>89</strong><span>Tổng câu hỏi</span><em>+18% hôm qua</em></div><div><strong>12</strong><span>Chưa trả lời được</span><em className="orange">Cần bổ sung</em></div></div><h4>Chủ đề phổ biến</h4><div className="topic-tags"><span>Thủ tục sinh viên <b>32</b></span><span>Biểu mẫu <b>24</b></span><span>Tra cứu hồ sơ <b>18</b></span><span>Học phí <b>15</b></span></div><div className="chat-activity-footer"><span><i /> AI đang hoạt động tốt</span><button>Xem báo cáo <ArrowRight size={13} /></button></div></div></div>
        <AdminChartCard title="Thủ tục phổ biến nhất" action="Xem chi tiết"><ResponsiveContainer width="100%" height={230}><BarChart data={popularProcedures} layout="vertical" margin={{left:20,right:20}}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf1f7" /><XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#8290a5'}} /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#62718a'}} width={100} /><Tooltip contentStyle={{border:'0',borderRadius:8,fontSize:11}} /><Bar dataKey="value" fill="#3b73d8" radius={[0,5,5,0]} barSize={18} /></BarChart></ResponsiveContainer></AdminChartCard></>}</main>
    </section>
  </div>;
}

function AdminSettings() {
  const { procedures, forms, applications, knowledgeBase, notifications, institution, setInstitution, resetData } = useDataStore();
  const [tab, setTab] = useState('ai');
  const [done, setDone] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [ai, setAi] = useState(() => { try { return JSON.parse(localStorage.getItem('tbu-ai-settings')) || { apiKey: localStorage.getItem('gemini_api_key') || '', model: 'gemini-2.0-flash', chunkSize: 512, topK: 5, temperature: 0.3, systemPrompt: 'Bạn là Trợ lý AI của Bộ phận Một cửa Trường Đại học Thái Bình. Trả lời bằng tiếng Việt thân thiện, chính xác và không bịa thông tin.' }; } catch { return { apiKey: '', model: 'gemini-2.0-flash', chunkSize: 512, topK: 5, temperature: 0.3, systemPrompt: '' }; } });
  const [org, setOrg] = useState(institution);
  const updateAi = (key, nextValue) => setAi(current => ({ ...current, [key]: nextValue }));
  const showDone = text => { setDone(text); window.setTimeout(() => setDone(''), 2600); };
  const saveAi = () => { localStorage.setItem('gemini_api_key', ai.apiKey.trim()); localStorage.setItem('tbu-ai-settings', JSON.stringify(ai)); showDone('Đã lưu cấu hình AI & RAG.'); };
  const testConnection = async () => {
    if (!ai.apiKey.trim()) { showDone('Vui lòng nhập Gemini API Key trước khi kiểm tra.'); return; }
    setTesting(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${ai.model}:generateContent?key=${encodeURIComponent(ai.apiKey.trim())}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: 'Trả lời ngắn gọn: Kết nối thành công.' }] }] }) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showDone('Kết nối Gemini API thành công.');
    } catch (error) {
      console.warn('Gemini connection test failed', error);
      showDone('Không thể kết nối Gemini API. Kiểm tra lại API Key hoặc mạng.');
    } finally { setTesting(false); }
  };
  const exportBackup = () => {
    const backup = { exportedAt: new Date().toISOString(), procedures, forms, applications, knowledgeBase, notifications, institution, aiSettings: { ...ai, apiKey: '' } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'tbu_motcua_backup.json'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); showDone('Đã xuất dữ liệu dự phòng JSON.');
  };
  const importBackup = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);
        if (!Array.isArray(backup.procedures) || !Array.isArray(backup.forms) || !Array.isArray(backup.applications)) throw new Error('Invalid backup shape');
        localStorage.setItem('tbu-procedures', JSON.stringify(backup.procedures)); localStorage.setItem('tbu-forms', JSON.stringify(backup.forms)); localStorage.setItem('tbu-applications', JSON.stringify(backup.applications)); if (backup.knowledgeBase) localStorage.setItem('tbu-knowledge-base', JSON.stringify(backup.knowledgeBase)); if (backup.notifications) localStorage.setItem('tbu-notifications', JSON.stringify(backup.notifications)); if (backup.institution) localStorage.setItem('tbu-institution', JSON.stringify(backup.institution)); window.location.reload();
      } catch (error) { console.warn('Backup import failed', error); showDone('File JSON không hợp lệ hoặc thiếu dữ liệu bắt buộc.'); }
    };
    reader.readAsText(file); event.target.value = '';
  };
  const restore = () => { resetData(); setConfirmReset(false); showDone('Đã khôi phục dữ liệu mẫu ban đầu.'); };
  return <div className="admin-shell"><AdminSideRail active="Cài đặt"/><section className="admin-main"><AdminTopbar title="Cài đặt"/><main className="admin-content settings-content"><div className="admin-page-heading"><div><h1>Cài đặt hệ thống</h1><p>Quản lý cấu hình AI, thông tin cơ quan và dữ liệu cổng Một cửa.</p></div></div><div className="settings-tabs">{[['ai','Cấu hình AI & RAG'],['org','Thông tin cơ quan'],['data','Quản trị dữ liệu']].map(([key,label]) => <button key={key} className={tab === key ? 'selected' : ''} onClick={() => setTab(key)}>{label}</button>)}</div>{tab === 'ai' && <div className="settings-card admin-card"><div className="settings-card-heading"><div><h2>Cấu hình AI & RAG Gemini</h2><p>Thiết lập mô hình và tham số cho Trợ lý AI Một cửa.</p></div><span className="settings-status"><i/> Sẵn sàng</span></div><div className="settings-form-grid"><label>Google Gemini API Key<div className="settings-secret"><input type={showKey ? 'text' : 'password'} value={ai.apiKey} onChange={e => updateAi('apiKey', e.target.value)} placeholder="AIza..." /><button type="button" onClick={() => setShowKey(value => !value)}>{showKey ? 'Ẩn' : 'Hiện'}</button></div><small>Key được lưu cục bộ trên trình duyệt, không gửi lên máy chủ của trường.</small></label><label>Model AI mặc định<select value={ai.model} onChange={e => updateAi('model', e.target.value)}><option value="gemini-2.0-flash">gemini-2.0-flash (Khuyên dùng)</option><option value="gemini-1.5-flash">gemini-1.5-flash</option><option value="gemini-1.5-pro">gemini-1.5-pro</option></select></label></div><div className="settings-inline-actions"><button className="admin-outline-btn" onClick={testConnection} disabled={testing}>{testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối API'}</button></div><h3 className="settings-section-title">Tham số RAG</h3><div className="settings-range-grid"><RangeSetting label="Chunk Size (Tokens)" value={ai.chunkSize} min={256} max={1024} step={64} suffix=" tokens" onChange={value => updateAi('chunkSize', Number(value))}/><RangeSetting label="Top-K Documents" value={ai.topK} min={1} max={10} step={1} suffix="" onChange={value => updateAi('topK', Number(value))}/><RangeSetting label="Temperature" value={ai.temperature} min={0} max={1} step={0.1} suffix="" onChange={value => updateAi('temperature', Number(value))}/></div><label className="settings-prompt">System Prompt Editor<textarea rows="8" value={ai.systemPrompt} onChange={e => updateAi('systemPrompt', e.target.value)}/></label><div className="settings-footer-actions"><button className="admin-primary-btn" onClick={saveAi}><Save size={15}/> Lưu cấu hình AI</button></div></div>}{tab === 'org' && <div className="settings-card admin-card"><div className="settings-card-heading"><div><h2>Thông tin cơ quan / Bộ phận Một cửa</h2><p>Thông tin này được hiển thị tại Footer và các trang công khai.</p></div></div><div className="settings-form-grid">{[['unitName','Tên đơn vị'],['departmentName','Tên bộ phận'],['address','Địa chỉ'],['hotline','Đường dây nóng / Hotline'],['email','Email tiếp nhận'],['workingHours','Thời gian làm việc']].map(([key,label]) => <label key={key}>{label}{key === 'workingHours' || key === 'address' || key === 'departmentName' ? <textarea rows={key === 'workingHours' ? 2 : 1} value={org[key]} onChange={e => setOrg(value => ({ ...value, [key]: e.target.value }))}/> : <input value={org[key]} onChange={e => setOrg(value => ({ ...value, [key]: e.target.value }))}/>}</label>)}</div><div className="settings-footer-actions"><button className="admin-primary-btn" onClick={() => { setInstitution(org); showDone('Đã lưu thông tin cơ quan.'); }}><Save size={15}/> Lưu thông tin</button></div></div>}{tab === 'data' && <div className="settings-card admin-card"><div className="settings-card-heading"><div><h2>Quản trị dữ liệu</h2><p>Sao lưu hoặc khôi phục dữ liệu đang được lưu trên trình duyệt.</p></div></div><div className="backup-actions"><button className="admin-primary-btn" onClick={exportBackup}><Download size={16}/> Xuất dữ liệu dự phòng (JSON)</button><label className="admin-outline-btn"> <UploadCloud size={16}/> Nhập dữ liệu từ file<input type="file" accept="application/json,.json" onChange={importBackup} hidden/></label></div><div className="backup-summary"><span><b>{procedures.length}</b> thủ tục</span><span><b>{forms.length}</b> biểu mẫu</span><span><b>{applications.length}</b> hồ sơ</span><span><b>{knowledgeBase.length}</b> tài liệu KB</span></div><div className="settings-danger-zone"><div><h3>Khôi phục dữ liệu mẫu ban đầu</h3><p>Xóa các thay đổi cục bộ và đưa hệ thống về dữ liệu mẫu gốc. Hành động này không thể hoàn tác.</p></div><button className="delete-confirm" onClick={() => setConfirmReset(true)}><RefreshCw size={15}/> Khôi phục dữ liệu mẫu</button></div></div>}{done && <div className="auth-alert success settings-toast"><CheckCircle2 size={16}/> {done}</div>}{confirmReset && <div className="modal-backdrop"><div className="delete-dialog"><div className="delete-symbol"><RefreshCw size={22}/></div><h2>Xác nhận khôi phục dữ liệu?</h2><p>Dữ liệu thủ tục, biểu mẫu, hồ sơ, Knowledge Base và thông báo hiện tại sẽ bị thay thế bằng dữ liệu mẫu gốc.</p><div className="modal-actions"><button className="admin-outline-btn" onClick={() => setConfirmReset(false)}>Hủy</button><button className="delete-confirm" onClick={restore}>Xác nhận khôi phục</button></div></div></div>}</main></section></div>;
}

function RangeSetting({ label, value, min, max, step, suffix, onChange }) {
  return <label className="range-setting"><span><b>{label}</b><strong>{value}{suffix}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(e.target.value)}/><small>{min}{suffix} - {max}{suffix}</small></label>;
}

function AdminChartCard({ title, action, children }) {
  return <div className="admin-card chart-card"><div className="card-title-row"><h2>{title}</h2>{action && <button className="chart-action">{action}<ChevronDown size={13} /></button>}</div>{children}</div>;
}

function AdminSkeleton() {
  return <><div className="kpi-grid">{[1,2,3,4].map(i => <div className="skeleton-card" key={i}><span /><div><i /><i /><i /></div></div>)}</div><div className="admin-chart-grid"><div className="admin-card skeleton-chart" /><div className="admin-card skeleton-chart" /></div><div className="admin-lower-grid"><div className="admin-card skeleton-table" /><div className="admin-card skeleton-table" /></div></>;
}

function Home({ navigate }) {
  return <div className="home">
    <section className="hero"><div className="hero-inner"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> DỊCH VỤ HÀNH CHÍNH TRỰC TUYẾN</div><h1>Một cửa<br /><em>một trải nghiệm</em></h1><p>Giải quyết thủ tục hành chính nhanh chóng, minh bạch và thuận tiện — ở bất cứ đâu.</p><div className="hero-buttons"><button className="primary-btn" onClick={() => navigate('procedures')}>Tra cứu thủ tục <ArrowRight size={17} /></button><button className="ghost-btn" onClick={() => navigate('apply')}>Nộp hồ sơ online</button></div><div className="hero-trust"><span><Check size={14} /> Quy trình minh bạch</span><span><Check size={14} /> Theo dõi 24/7</span></div></div><div className="hero-visual"><div className="visual-card"><div className="visual-top"><span className="dot red" /><span className="dot yellow" /><span className="dot green" /><small>Cổng Một cửa điện tử</small></div><div className="visual-content"><div className="visual-title"><span className="mini-logo"><Building2 size={17} /></span><span><b>Hồ sơ của tôi</b><small>Cập nhật lúc 10:24</small></span><span className="status-chip">Đang xử lý</span></div><div className="progress-line"><span /><span /><span /><span /><span /></div><div className="visual-rows"><div><FileText size={19} /><span>Đăng ký xác nhận sinh viên<small>HS-2026-001234</small></span><strong>65%</strong></div><div><ShieldCheck size={19} /><span>Cấp lại thẻ sinh viên<small>HS-2026-001198</small></span><strong className="done">100%</strong></div></div></div></div><div className="float-card"><span className="float-icon"><Zap size={18} /></span><span><b>Tiết kiệm thời gian</b><small>Không cần xếp hàng</small></span></div></div></div></section>
    <section className="section quick-section"><div className="section-heading"><div><span className="label">BẮT ĐẦU NGAY</span><h2>Mọi điều bạn cần, <span>ngay trong tầm tay</span></h2></div><p>Trải nghiệm dịch vụ hành chính hiện đại, chủ động và thuận tiện.</p></div><div className="quick-grid">{[{icon: Search, title: 'Tra cứu thủ tục', text: 'Tìm kiếm và xem hướng dẫn thủ tục hành chính', page:'procedures'}, {icon: FileText, title: 'Nộp hồ sơ', text: 'Nộp hồ sơ trực tuyến nhanh chóng', page:'apply'}, {icon: Clock3, title: 'Theo dõi hồ sơ', text: 'Kiểm tra tiến độ xử lý hồ sơ', page:'track'}, {icon: Bot, title: 'Hỏi AI', text: 'Trò chuyện với trợ lý AI thông minh'}].map((item) => <button className="quick-card" key={item.title} onClick={() => item.page && navigate(item.page)}><span className="quick-icon"><item.icon size={22} /></span><span><b>{item.title}</b><small>{item.text}</small></span><ArrowRight size={17} /></button>)}</div></section>
    <section className="section departments"><div className="section-heading centered"><div><span className="label">KHÁM PHÁ DỊCH VỤ</span><h2>Thủ tục theo <span>phòng ban</span></h2></div><button className="text-btn" onClick={() => navigate('procedures')}>Xem tất cả <ArrowRight size={16} /></button></div><div className="dept-grid">{[{icon:Users, name:'Phòng Tổ chức Cán bộ', count:'12 thủ tục'}, {icon:Calculator, name:'Phòng Kế hoạch - Tài chính', count:'8 thủ tục'}, {icon:FlaskConical, name:'Phòng KHCN & HTPT', count:'10 thủ tục'}, {icon:Building2, name:'Văn phòng', count:'7 thủ tục'}, {icon:GraduationCap, name:'Phòng Đào tạo', count:'18 thủ tục'}].map((d) => <div className="dept-card" key={d.name}><span className="dept-icon"><d.icon size={21} /></span><b>{d.name}</b><small>{d.count}</small><button onClick={() => navigate('procedures')}>Xem thủ tục <ArrowRight size={14} /></button></div>)}</div></section>
    <section className="stats"><div className="stats-inner">{[['2,500+','Hồ sơ đã xử lý'],['98%','Tỷ lệ hài lòng'],['3 ngày','Thời gian xử lý TB'],['24/7','Hỗ trợ AI Chatbot']].map(([n,l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div></section>
    <section className="section news-section"><div className="section-heading centered"><div><span className="label">CẬP NHẬT MỚI NHẤT</span><h2>Tin tức & <span>thông báo</span></h2></div><button className="text-btn" onClick={() => navigate('news')}>Xem tất cả <ArrowRight size={16} /></button></div><div className="news-grid">{news.map((item, i) => <article className="news-card" key={item.title}><div className={`news-image img-${i}`}><span>{i === 0 ? 'MỘT CỬA' : 'THÔNG BÁO'}</span></div><div className="news-body"><small>{item.date}</small><h3>{item.title}</h3><p>{item.text}</p><button className="text-btn">Xem thêm <ArrowRight size={14} /></button></div></article>)}</div></section>
    <section className="cta"><div><span className="label light">LUÔN SẴN SÀNG HỖ TRỢ</span><h2>Bạn cần hỗ trợ?</h2><p>Trợ lý AI của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p></div><button className="white-btn">Chat với AI ngay <MessageCircle size={17} /></button></section>
  </div>;
}

function PageHeader({ eyebrow, title, desc }) { return <section className="page-header"><div className="container"><span className="label">{eyebrow}</span><h1>{title}</h1>{desc && <p>{desc}</p>}</div></section>; }

function Procedures({ navigate }) {
  const { procedures: sharedProcedures } = useDataStore();
  const [query, setQuery] = useState('');
  const filtered = sharedProcedures.map(publicProcedure).filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader eyebrow="DANH MỤC DỊCH VỤ" title="Thủ tục hành chính" desc="Tìm kiếm và thực hiện thủ tục trực tuyến một cách đơn giản, minh bạch." /><section className="container content-section"><div className="breadcrumb">Trang chủ <ArrowRight size={13} /> Thủ tục hành chính</div><div className="toolbar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm thủ tục..." /></div><button className="filter-btn"><span>Lọc theo phòng ban</span><ChevronDown size={16} /></button></div><div className="procedure-layout"><aside className="filter-panel"><b>Bộ lọc</b><label className="filter-label">Đối tượng</label>{['Sinh viên','Cán bộ / Giảng viên','Tất cả'].map(x => <label className="check-label" key={x}><input type="checkbox" /> {x}<span /></label>)}<label className="filter-label">Phòng ban</label>{['Phòng Đào tạo','Phòng Tổ chức Cán bộ','Phòng Kế hoạch - Tài chính','Văn phòng'].map(x => <label className="check-label" key={x}><input type="checkbox" /> {x}<span /></label>)}<button className="clear-btn">Xóa bộ lọc</button></aside><div className="procedure-results"><div className="result-head"><b>Hiển thị {filtered.length + 39} thủ tục</b><button>Sắp xếp: <strong>Mới nhất</strong> <ChevronDown size={14} /></button></div><div className="procedure-grid">{filtered.map((p) => <article className="procedure-card" key={p.title}><div className="procedure-top"><span className="procedure-icon"><p.icon size={21} /></span><span className="tag">{p.audience}</span></div><small className="dept-name">{p.dept}</small><h3>{p.title}</h3><p>Hướng dẫn chi tiết các bước thực hiện và hồ sơ cần chuẩn bị.</p><div className="card-bottom"><span><Clock3 size={14} /> {p.time}</span><button onClick={() => navigate(`procedures/${p.id}`)}>Xem chi tiết <ArrowRight size={14} /></button></div></article>)}</div></div></div></section></>;
}

function ProcedureDetail({ procedure, navigate, onAsk }) {
  const [tab, setTab] = useState('steps');
  return <><PageHeader eyebrow="CHI TIẾT THỦ TỤC" title={procedure.title} desc="Thông tin đầy đủ, minh bạch về quy trình và thành phần hồ sơ." /><section className="container procedure-detail-page"><div className="breadcrumb">Trang chủ <ArrowRight size={13}/> Thủ tục hành chính <ArrowRight size={13}/> {procedure.title}</div><div className="procedure-detail-heading"><div><span className="procedure-code-badge">{procedure.code}</span><h1>{procedure.title}</h1></div><span className="detail-audience">{procedure.audience}</span></div><div className="procedure-facts">{[['ĐƠN VỊ CHỦ QUẢN',procedure.dept],['THỜI HẠN GIẢI QUYẾT',procedure.time],['LỆ PHÍ',procedure.fee],['ĐỐI TƯỢNG ÁP DỤNG',procedure.audience],['HÌNH THỨC TIẾP NHẬN',procedure.intake]].map(([label,value])=><div key={label}><small>{label}</small><b>{value}</b></div>)}</div><div className="procedure-detail-layout"><main className="procedure-detail-main"><div className="detail-tabs">{[['steps','Trình tự thực hiện'],['documents','Hồ sơ yêu cầu'],['forms','Biểu mẫu đính kèm'],['legal','Căn cứ pháp lý & FAQ']].map(([id,label])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{label}</button>)}</div>{tab==='steps'&&<div className="detail-stepper">{procedure.steps.map((step,index)=><div className="detail-step" key={step[0]}><span className="step-number">{index+1}</span><div><h3>{step[0]}</h3><div className="step-meta"><span>{step[1]}</span><span>Thời gian tối đa: {step[2]}</span></div><p>{step[3]}</p><small><FileText size={14}/> Biểu mẫu: {step[4]}</small></div></div>)}</div>}{tab==='documents'&&<div className="detail-table-wrap"><table className="detail-doc-table"><thead><tr><th>Tên giấy tờ</th><th>Bản chính</th><th>Bản sao</th><th>Ghi chú chuẩn bị</th><th></th></tr></thead><tbody>{procedure.documents.map(doc=><tr key={doc[0]}><td><b>{doc[0]}</b></td><td>{doc[1]}</td><td>{doc[2]}</td><td>{doc[3]}</td><td>{doc[4]&&<button className="detail-link"><Download size={14}/> Tải mẫu</button>}</td></tr>)}</tbody></table></div>}{tab==='forms'&&<div className="detail-forms-grid">{procedure.forms.map(form=><div className="attached-form-card" key={form[0]}><span className={form[1]==='PDF'?'form-file-icon pdf':'form-file-icon'}><FileText size={23}/></span><div><b>{form[0]}</b><small>{form[1]} · {form[2]}</small></div><div className="attached-actions"><button title="Xem trước"><Eye size={16}/></button><button title="Tải về"><Download size={16}/></button></div></div>)}</div>}{tab==='legal'&&<div className="legal-faq"><h3>Văn bản, quyết định liên quan</h3><ul>{procedure.legal.map(item=><li key={item}><ShieldCheck size={16}/>{item}</li>)}</ul><h3>Câu hỏi thường gặp</h3>{procedure.faqs.map((faq,index)=><details key={faq[0]} open={index===0}><summary>{faq[0]}<ChevronDown size={16}/></summary><p>{faq[1]}</p></details>)}</div>}</main><aside className="detail-action-panel"><h3>Thực hiện thủ tục</h3><p>Bạn đã sẵn sàng? Hãy bắt đầu hồ sơ trực tuyến ngay hôm nay.</p><button className="primary-btn" onClick={()=>navigate(`apply?procedure=${procedure.id}`)}><FileText size={16}/> Nộp hồ sơ trực tuyến</button><button className="outline-btn"><Download size={16}/> Tải toàn bộ biểu mẫu</button><button className="ask-ai-btn" onClick={()=>onAsk(procedure)}><Bot size={16}/> Hỏi AI về thủ tục này</button></aside></div></section></>;
}

function Forms() {
  const { forms } = useDataStore();
  return <><PageHeader eyebrow="TÀI NGUYÊN & BIỂU MẪU" title="Tải biểu mẫu" desc="Tải xuống các biểu mẫu hành chính mới nhất của Trường Đại học Thái Bình." /><section className="container content-section"><div className="tabs">{['Tất cả','Nghỉ phép & Thai sản','Lương & Phụ cấp','Hợp đồng lao động','Đào tạo'].map((x,i) => <button className={i===0?'selected':''} key={x}>{x}</button>)}</div><div className="form-list">{forms.map((form,i) => <div className="form-row" key={form.code || form.name}><span className={i % 2 ? 'file-icon doc' : 'file-icon pdf'}><FileText size={21} /></span><div><b>{form.name}</b><small>Biểu mẫu hành chính · Cập nhật {form.date || '10/2026'}</small></div><span className="format">{form.type || 'PDF'} · {form.size || '1.2 MB'}</span><button className="download-btn">Tải xuống <ArrowRight size={15} /></button></div>)}</div></section></>;
}

function Apply({ navigate, currentUser }) {
  const [step, setStep] = useState(1);
  const { procedures: sharedProcedures, setApplications, addNotification } = useDataStore();
  const selectedId = new URLSearchParams(window.location.search).get('procedure');
  const selected = sharedProcedures.map(publicProcedure).find(item => item.id === selectedId) || publicProcedure(sharedProcedures[0] || procedures[0]);
  const submitApplication = () => {
    const code = `HS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const applicant = currentUser?.name || 'Nguyễn Lan Anh';
    setApplications(value => [{ code, applicant, email: currentUser?.email, procedure: selected.title, procedureId: selected.id, date: new Date().toLocaleDateString('vi-VN'), submittedAt: new Date().toISOString(), priority: 'blue', staff: 'Mới', elapsed: '0 ngày', dept: selected.dept, status: 'Tiếp nhận', files: ['don-de-nghi.pdf'], timeline: [{ status: 'Tiếp nhận', at: new Date().toISOString(), by: 'Hệ thống', note: 'Hồ sơ đã được gửi thành công.' }] }, ...value]);
    addNotification({ audience: 'admin', type: 'new-application', text: `Có hồ sơ mới từ ${applicant}`, code });
    navigate('track');
  };
  return <><PageHeader eyebrow="DỊCH VỤ TRỰC TUYẾN" title="Nộp hồ sơ trực tuyến" desc="Hoàn tất hồ sơ của bạn chỉ với vài bước đơn giản." /><section className="container content-section"><div className="wizard-steps">{['Chọn thủ tục','Thông tin cá nhân','Tải hồ sơ','Xác nhận & gửi'].map((s,i) => <div className={step > i+1 ? 'wizard-step done' : step === i+1 ? 'wizard-step current' : 'wizard-step'} key={s}><span>{step > i+1 ? <Check size={15} /> : i + 1}</span><b>{s}</b></div>)}</div><div className="apply-card">{step===1 && <><h2>Chọn thủ tục bạn muốn thực hiện</h2><p className="muted">Tìm kiếm trong danh mục thủ tục hành chính của trường.</p><div className="selected-procedure"><span className="quick-icon"><selected.icon size={20} /></span><div><small>THỦ TỤC ĐƯỢC CHỌN</small><b>{selected.title}</b><p>{selected.dept} · Thời gian xử lý: {selected.time}</p></div><Check className="selected-check" size={19} /></div></>}{step===2 && <><h2>Thông tin cá nhân</h2><p className="muted">Thông tin được bảo mật và chỉ sử dụng cho hồ sơ này.</p><div className="form-fields"><label>Họ và tên<input value="Nguyễn Lan Anh" readOnly /></label><label>Mã sinh viên / CBGV<input value="21D100123" readOnly /></label><label>Email<input value="lananh@tbu.edu.vn" readOnly /></label><label>Số điện thoại<input value="0988 123 456" readOnly /></label></div></>}{step===3 && <><h2>Tải hồ sơ</h2><p className="muted">Tải lên các tài liệu cần thiết theo yêu cầu của thủ tục.</p><div className="drop-zone"><UploadCloud size={30} /><b>Kéo thả tệp vào đây hoặc <span>chọn tệp</span></b><small>PDF, DOC, DOCX, JPG, PNG · Tối đa 10MB/tệp</small></div></>}{step===4 && <><h2>Xác nhận & gửi hồ sơ</h2><p className="muted">Vui lòng kiểm tra lại thông tin trước khi gửi.</p><div className="confirm-list"><div><span>Thủ tục</span><b>Đăng ký xác nhận sinh viên</b></div><div><span>Người nộp</span><b>Nguyễn Lan Anh · 21D100123</b></div><div><span>Tài liệu</span><b>don-xac-nhan-sinh-vien.pdf</b></div></div><label className="agreement"><input type="checkbox" defaultChecked /> Tôi cam kết các thông tin cung cấp là chính xác.</label></> }<div className="wizard-actions">{step > 1 && <button className="outline-btn" onClick={() => setStep(step - 1)}>Quay lại</button>}  <button className="primary-btn" onClick={() => step < 4 ? setStep(step + 1) : submitApplication()}>{step === 4 ? 'Gửi hồ sơ' : 'Tiếp theo'} <ArrowRight size={16} /></button></div></div></section></>;
}

function Track({ currentUser }) {
  const { applications } = useDataStore();
  const [receipt, setReceipt] = useState(null);
  const [code, setCode] = useState(new URLSearchParams(window.location.search).get('code') || '');
  const [searched, setSearched] = useState(new URLSearchParams(window.location.search).get('code') || '');
  const item = applications.find(application => application.code === searched) || (searched ? null : applications.find(application => currentUser && application.email === currentUser.email) || applications[0]);
  return <><PageHeader eyebrow="MINH BẠCH & CHỦ ĐỘNG" title="Tra cứu hồ sơ" desc="Theo dõi tiến độ xử lý hồ sơ của bạn ở bất cứ đâu." /><section className="container content-section track-section"><div className="track-search"><div className="search-box"><Search size={18} /><input placeholder="Nhập mã hồ sơ hoặc số CMND/CCCD" value={code} onChange={event => setCode(event.target.value)} /></div><button className="primary-btn" onClick={() => setSearched(code.trim())}>Tra cứu <ArrowRight size={16} /></button></div>{item ? <div className="application-card"><div className="application-head"><div><small>MÃ HỒ SƠ</small><h2>{item.code}</h2><p>{item.procedure}</p></div><span className="status-badge"><i /> {item.status}</span></div><div className="timeline">{(item.timeline || [{ status:'Tiếp nhận', at:item.submittedAt || item.date, by:'Hệ thống', note:'Hồ sơ đã được tiếp nhận.' }]).map((event,index) => <div className="timeline-item done" key={`${event.status}-${event.at}`}><span className="timeline-dot"><Check size={13} /></span><div><b>{event.status}</b><small>{event.at ? new Date(event.at).toLocaleString('vi-VN') : item.date} · {event.by}</small>{event.note && <p>{event.note}</p>}</div></div>)}  </div><button className="primary-btn track-receipt-button" onClick={() => setReceipt(item)}><FileText size={15}/> In phiếu hẹn trả kết quả  </button></div> : searched && <div className="empty-state"><h3>Không tìm thấy hồ sơ</h3><p>Vui lòng kiểm tra lại mã hồ sơ HS-2026-XXXX.</p></div>}  </section>{receipt && <ReceiptModal item={receipt} onClose={() => setReceipt(null)} />}</>; }
function News() { return <><PageHeader eyebrow="TIN TỨC & THÔNG BÁO" title="Tin tức" desc="Thông tin mới nhất từ Trường Đại học Thái Bình." /><section className="container content-section"><div className="news-grid news-page">{news.concat(news).map((item,i) => <article className="news-card" key={`${item.title}-${i}`}><div className={`news-image img-${i%3}`}><span>{i%2 ? 'THÔNG BÁO' : 'MỘT CỬA'}</span></div><div className="news-body"><small>{item.date}</small><h3>{item.title}</h3><p>{item.text}</p><button className="text-btn">Đọc bài viết <ArrowRight size={14} /></button></div></article>)}</div></section></>; }
function Profile() { return <><PageHeader eyebrow="TÀI KHOẢN CỦA TÔI" title="Hồ sơ cá nhân" desc="Quản lý thông tin tài khoản và lịch sử hồ sơ của bạn." /><section className="container content-section"><div className="profile-card"><div className="profile-cover"><span className="large-avatar">NL</span><div><h2>Nguyễn Lan Anh</h2><p>Sinh viên · Khoa Kinh tế</p></div><button className="outline-btn">Chỉnh sửa hồ sơ</button></div><div className="profile-tabs"><button className="selected">Thông tin cá nhân</button><button>Đổi mật khẩu</button><button>Thông báo</button><button>Lịch sử hồ sơ</button></div><div className="form-fields profile-fields"><label>Họ và tên<input value="Nguyễn Lan Anh" readOnly /></label><label>Mã sinh viên<input value="21D100123" readOnly /></label><label>Email<input value="lananh@tbu.edu.vn" readOnly /></label><label>Số điện thoại<input value="0988 123 456" readOnly /></label></div></div></section></>; }

createRoot(document.getElementById('root')).render(<DataStoreProvider><App /></DataStoreProvider>);
