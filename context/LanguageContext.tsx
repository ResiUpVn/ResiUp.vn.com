
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// --- TRANSLATION DATA ---

const en = {
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    challenges: 'Challenges',
    breathing: 'Breathing',
    journal: 'Journal',
    chatbot: 'AI Chatbot',
    tests: 'Tests',
    natureSounds: 'Nature Sounds',
    resources: 'Resources',
    forum: 'Forum',
    admin: 'Admin',
  },
  sidebar: {
    viewProfile: 'View Profile',
    logout: 'Logout',
  },
  features: {
    challenge: { title: 'Daily Challenge', desc: 'Build positive habits, one day at a time.' },
    breathing: { title: 'Breathing', desc: 'Calm your mind with guided exercises.' },
    sounds: { title: 'Nature Sounds', desc: 'Relax with calming videos from nature.' },
    journal: { title: 'Journal', desc: 'Reflect on your thoughts and feelings.' },
    chatbot: { title: 'AI Chatbot', desc: 'Talk to Resi, your supportive AI friend.' },
    tests: { title: 'Tests', desc: 'Gain insights into your mental well-being.' },
  },
  home: {
    welcomeBack: 'Welcome back',
    welcome: 'Welcome!',
    subtitle: 'Ready to continue your journey of self-discovery?',
    quoteTitle: 'Quote of the Day',
    quoteText: '"The curious paradox is that when I accept myself just as I am, then I can change."',
    quickAccess: 'Quick Access',
  },
  challenges: {
    title: 'Daily Challenge',
    subtitle: 'A small step each day towards a better you.',
    list: [
      "Write down three things you're grateful for today.",
      "Spend 5 minutes doing a mindful breathing exercise.",
      "Go for a 15-minute walk outside and notice your surroundings.",
      "Reach out to a friend or family member you haven't spoken to in a while.",
      "Do one small act of kindness for someone else.",
      "Spend 10 minutes tidying up a small area of your space.",
      "Listen to a favorite uplifting song without distractions.",
      "Write down a short-term goal you want to accomplish this week.",
      "Try a 5-minute guided meditation.",
      "Stretch your body for 10 minutes.",
      "Drink a full glass of water as soon as you wake up.",
      "Read a chapter of a book.",
      "Avoid checking social media for the first hour of your day.",
      "Compliment a stranger or a colleague.",
      "Write down one thing you like about yourself.",
    ],
    todaysFocus: "Today's Focus",
    loading: 'Loading challenge...',
    completed: 'Completed!',
    markComplete: 'Mark as Complete',
  },
  breathing: {
    title: 'Mindful Breathing',
    subtitle: 'Follow the guide to calm your mind and body.',
    breatheIn: 'Breathe In',
    hold: 'Hold',
    breatheOut: 'Breathe Out',
    getReady: 'Get ready...',
    stop: 'Stop Session',
    start: 'Start Session',
  },
  sounds: {
    title: 'Nature Sounds',
    subtitle: 'Choose a video to relax, focus, or meditate.',
    noSoundsTitle: 'No Sounds Available',
    noSoundsDesc: 'The admin has not added any nature sounds yet. Please check back later.',
    chooseSound: 'Choose another sound',
    playing: 'Playing',
  },
  journal: {
    title: 'My Journal',
    subtitle: 'A private space for your thoughts and feelings.',
    todaysEntry: "Today's Entry",
    placeholder: "What's on your mind...?",
    save: 'Save Entry',
    pastEntries: 'Past Entries',
    noEntries: 'You have no journal entries yet.',
  },
  tests: {
    title: 'Self-Assessment Tests',
    subtitle: 'Gain insights into your mental well-being using the DASS-21 scale.',
    dass21: {
      title: 'Depression, Anxiety and Stress Scale - 21 Items (DASS-21)',
      instruction: 'Please read each statement and circle a number 0, 1, 2 or 3 which indicates how much the statement applied to you over the past week. There are no right or wrong answers. Do not spend too much time on any statement.',
      questions: [
        { text: "I found it hard to wind down", scale: 'S' },
        { text: "I was aware of dryness of my mouth", scale: 'A' },
        { text: "I couldn’t seem to experience any positive feeling at all", scale: 'D' },
        { text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)", scale: 'A' },
        { text: "I found it difficult to work up the initiative to do things", scale: 'D' },
        { text: "I tended to over-react to situations", scale: 'S' },
        { text: "I experienced trembling (e.g. in the hands)", scale: 'A' },
        { text: "I felt that I was using a lot of nervous energy", scale: 'S' },
        { text: "I was worried about situations in which I might panic and make a fool of myself", scale: 'A' },
        { text: "I felt that I had nothing to look forward to", scale: 'D' },
        { text: "I found myself getting agitated", scale: 'S' },
        { text: "I found it difficult to relax", scale: 'S' },
        { text: "I felt down-hearted and blue", scale: 'D' },
        { text: "I was intolerant of anything that kept me from getting on with what I was doing", scale: 'S' },
        { text: "I felt I was close to panic", scale: 'A' },
        { text: "I was unable to become enthusiastic about anything", scale: 'D' },
        { text: "I felt I wasn’t worth much as a person", scale: 'D' },
        { text: "I felt that I was rather touchy", scale: 'S' },
        { text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)", scale: 'A' },
        { text: "I felt scared without any good reason", scale: 'A' },
        { text: "I felt that life was meaningless", scale: 'D' },
      ],
      options: [
        "Did not apply to me at all",
        "Applied to me to some degree, or some of the time",
        "Applied to me to a considerable degree, or a good part of time",
        "Applied to me very much, or most of the time",
      ],
      severity: {
        depression: [
            { level: 'Normal', range: [0, 9], color: 'bg-green-500' },
            { level: 'Mild', range: [10, 13], color: 'bg-yellow-400' },
            { level: 'Moderate', range: [14, 20], color: 'bg-orange-500' },
            { level: 'Severe', range: [21, 27], color: 'bg-red-500' },
            { level: 'Extremely Severe', range: [28, 999], color: 'bg-red-700' },
        ],
        anxiety: [
            { level: 'Normal', range: [0, 7], color: 'bg-green-500' },
            { level: 'Mild', range: [8, 9], color: 'bg-yellow-400' },
            { level: 'Moderate', range: [10, 14], color: 'bg-orange-500' },
            { level: 'Severe', range: [15, 19], color: 'bg-red-500' },
            { level: 'Extremely Severe', range: [20, 999], color: 'bg-red-700' },
        ],
        stress: [
            { level: 'Normal', range: [0, 14], color: 'bg-green-500' },
            { level: 'Mild', range: [15, 18], color: 'bg-yellow-400' },
            { level: 'Moderate', range: [19, 25], color: 'bg-orange-500' },
            { level: 'Severe', range: [26, 33], color: 'bg-red-500' },
            { level: 'Extremely Severe', range: [34, 999], color: 'bg-red-700' },
        ],
        unknown: 'Unknown'
      }
    },
    errors: {
        incomplete: 'Please answer all questions before viewing the results.'
    },
    viewResults: 'View My Results',
    results: {
        title: 'Your DASS-21 Results',
        date: 'Test completed on: {{date}}',
        disclaimer: 'Disclaimer: This is not a diagnostic tool. These results are for informational purposes only and should not be considered a substitute for professional medical advice, diagnosis, or treatment. If you are concerned about your mental health, please consult a qualified healthcare provider.',
        depression: 'Depression',
        anxiety: 'Anxiety',
        stress: 'Stress'
    },
    retake: 'Retake Test'
  },
  chatbot: {
    title: 'Chat with Resi',
    subtitle: 'Your personal AI assistant for guidance and support.',
    error: 'Sorry, something went wrong. Please try again.',
    apiKeyError: 'The AI service is not configured. The administrator needs to set the API key for the chatbot to work.',
    welcome: "Hello! I'm Resi, your friendly AI assistant. How are you feeling today? You can talk to me about anything on your mind.",
    placeholder: 'Type your message here...',
  },
  forum: {
    title: 'Community Forum',
    subtitle: 'Connect with others on a similar journey.',
    createPost: 'Create New Post',
    discussions: 'Discussions',
    postBy: 'By {{author}} on {{date}}',
    noPosts: 'No posts yet. Be the first to start a discussion!',
    modal: {
      title: 'Create a New Post',
      postTitle: 'Title',
      content: 'Content',
      cancel: 'Cancel',
      post: 'Post',
    },
  },
  resources: {
    title: 'Wellness Resources',
    subtitle: 'A curated library of helpful articles, videos, and tools.',
    noResourcesTitle: 'No Resources Available',
    noResourcesDesc: 'The admin has not added any resources yet. Please check back later.',
  },
  dashboard: {
    title: 'My Dashboard',
    subtitle: 'Track your progress and celebrate your growth.',
    completed: 'Completed',
    missed: 'Missed',
    completedChallenges: 'Completed Challenges',
    journalEntries: 'Journal Entries',
    currentStreak: 'Current Streak',
    days: 'days',
    latestTestResult: 'Latest Test Result',
    journalChartTitle: 'Journal Entries (Last 7 Days)',
    entries: 'Entries',
    challengeChartTitle: 'Challenge Completion',
  },
  login: {
    error: 'Invalid email or password. Please try again.',
    welcome: 'Welcome Back',
    subtitle: 'Sign in to continue your journey',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    signInButton: 'Sign in',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign up',
  },
  signup: {
    errorExists: 'An account with this email already exists.',
    errorReserved: 'This email address is reserved and cannot be used for signup.',
    errorGeneric: 'Failed to create an account. Please try again.',
    title: 'Create an Account',
    subtitle: 'Start your journey of self-discovery today',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    signUpButton: 'Sign up',
    hasAccount: 'Already have an account?',
    signInLink: 'Sign in',
  },
  profile: {
    title: 'My Profile',
    subtitle: 'Manage your account settings.',
    email: 'Email',
    logoutButton: 'Logout',
    disclaimer1: 'This is a simulated authentication system.',
    disclaimer2: "User data is stored in your browser's local storage.",
  },
  admin: {
    title: 'Admin Panel',
    subtitle: 'Manage application settings and users.',
    users: {
        deleteSelfError: 'You cannot delete your own admin account.',
        deleteConfirm: 'Are you sure you want to delete user {{email}}? This action cannot be undone.',
        title: 'Users ({{count}})',
        email: 'Email',
        role: 'Role',
        delete: 'Delete',
        admin: 'Admin',
        user: 'User'
    },
    forum: {
        deleteConfirm: 'Are you sure you want to delete this post and all its comments?',
        title: 'Forum Posts ({{count}})',
        postTitle: 'Title',
        author: 'Author',
        createdAt: 'Created At',
        delete: 'Delete'
    },
    resources: {
        addError: 'Title and a valid YouTube URL/ID are required.',
        title: 'Manage Resource Videos',
        addTitle: 'Add New Video',
        videoTitle: 'Video Title',
        description: 'Video Description',
        url: 'YouTube URL or Video ID',
        addButton: 'Add Resource'
    },
    sounds: {
        addError: 'Name and a valid YouTube URL/ID are required.',
        title: 'Manage Nature Sounds',
        addTitle: 'Add New Sound',
        name: 'Sound Name / Title',
        url: 'YouTube URL or Video ID',
        addButton: 'Add Sound'
    },
    knowledge: {
        addError: 'Title and content are required.',
        deleteConfirm: 'Are you sure you want to delete this knowledge document?',
        title: 'Manage Chatbot Knowledge Base',
        addTitle: 'Add New Document',
        docTitle: 'Document Title',
        content: 'Document Content...',
        addButton: 'Add Document'
    },
    tabs: {
        users: 'Users',
        forum: 'Forum',
        chatLogs: 'Chatbot Logs',
        chatKnowledge: 'Chatbot Knowledge',
        resources: 'Resources',
        sounds: 'Nature Sounds',
    },
    chatLogs: {
        transcriptTitle: 'Chat Transcript',
        transcriptInfo: 'User: {{email}} | Session: {{date}}',
        close: 'Close',
        title: 'Chat Sessions ({{count}})',
        messages: '{{count}} messages'
    }
  },
  post: {
    deletePostConfirm: 'Are you sure you want to delete this post and all its comments?',
    deleteCommentConfirm: 'Are you sure you want to delete this comment?',
    notFound: 'Post not found or is loading...',
    backToForum: 'Back to Forum',
    commentsTitle: 'Comments ({{count}})',
    leaveComment: 'Leave a comment',
    commentPlaceholder: 'Share your thoughts...',
    postComment: 'Post Comment',
    noComments: 'No comments yet.',
  },
};

const vi = {
  nav: {
    home: 'Trang chủ',
    dashboard: 'Bảng điều khiển',
    challenges: 'Thử thách',
    breathing: 'Hít thở',
    journal: 'Nhật ký',
    chatbot: 'Chatbot AI',
    tests: 'Bài kiểm tra',
    natureSounds: 'Âm thanh thiên nhiên',
    resources: 'Tài nguyên',
    forum: 'Diễn đàn',
    admin: 'Quản trị',
  },
  sidebar: {
    viewProfile: 'Xem hồ sơ',
    logout: 'Đăng xuất',
  },
  features: {
    challenge: { title: 'Thử thách hàng ngày', desc: 'Xây dựng thói quen tích cực, mỗi ngày một bước.' },
    breathing: { title: 'Hít thở', desc: 'Làm dịu tâm trí của bạn với các bài tập có hướng dẫn.' },
    sounds: { title: 'Âm thanh thiên nhiên', desc: 'Thư giãn với những video âm thanh nhẹ nhàng từ thiên nhiên.' },
    journal: { title: 'Nhật ký', desc: 'Suy ngẫm về những suy nghĩ và cảm xúc của bạn.' },
    chatbot: { title: 'Chatbot AI', desc: 'Trò chuyện với Resi, người bạn AI luôn hỗ trợ bạn.' },
    tests: { title: 'Bài kiểm tra', desc: 'Hiểu rõ hơn về sức khỏe tinh thần của bạn.' },
  },
  home: {
    welcomeBack: 'Chào mừng trở lại',
    welcome: 'Chào mừng!',
    subtitle: 'Sẵn sàng tiếp tục hành trình khám phá bản thân?',
    quoteTitle: 'Trích dẫn trong ngày',
    quoteText: '"Nghịch lý kỳ lạ là khi tôi chấp nhận con người thật của mình, thì tôi có thể thay đổi."',
    quickAccess: 'Truy cập nhanh',
  },
  challenges: {
    title: 'Thử thách hàng ngày',
    subtitle: 'Một bước nhỏ mỗi ngày hướng tới một bạn tốt hơn.',
    list: [
      "Viết ra ba điều bạn biết ơn hôm nay.",
      "Dành 5 phút để thực hiện một bài tập hít thở chánh niệm.",
      "Đi bộ 15 phút bên ngoài và chú ý đến môi trường xung quanh bạn.",
      "Liên lạc với một người bạn hoặc thành viên gia đình mà bạn đã lâu không nói chuyện.",
      "Làm một hành động tử tế nhỏ cho người khác.",
      "Dành 10 phút để dọn dẹp một khu vực nhỏ trong không gian của bạn.",
      "Nghe một bài hát yêu thích giúp nâng cao tinh thần mà không bị phân tâm.",
      "Viết ra một mục tiêu ngắn hạn bạn muốn hoàn thành trong tuần này.",
      "Thử một bài thiền có hướng dẫn trong 5 phút.",
      "Giãn cơ thể trong 10 phút.",
      "Uống một ly nước đầy ngay sau khi thức dậy.",
      "Đọc một chương sách.",
      "Tránh kiểm tra mạng xã hội trong giờ đầu tiên của ngày.",
      "Khen ngợi một người lạ hoặc một đồng nghiệp.",
      "Viết ra một điều bạn thích về bản thân.",
    ],
    todaysFocus: 'Tập trung hôm nay',
    loading: 'Đang tải thử thách...',
    completed: 'Đã hoàn thành!',
    markComplete: 'Đánh dấu đã hoàn thành',
  },
  breathing: {
    title: 'Hít thở chánh niệm',
    subtitle: 'Làm theo hướng dẫn để làm dịu tâm trí và cơ thể của bạn.',
    breatheIn: 'Hít vào',
    hold: 'Giữ',
    breatheOut: 'Thở ra',
    getReady: 'Sẵn sàng...',
    stop: 'Dừng',
    start: 'Bắt đầu',
  },
  sounds: {
    title: 'Âm thanh thiên nhiên',
    subtitle: 'Chọn một video để thư giãn, tập trung hoặc thiền định.',
    noSoundsTitle: 'Không có âm thanh nào',
    noSoundsDesc: 'Quản trị viên chưa thêm âm thanh thiên nhiên nào. Vui lòng kiểm tra lại sau.',
    chooseSound: 'Chọn một âm thanh khác',
    playing: 'Đang phát',
  },
  journal: {
    title: 'Nhật ký của tôi',
    subtitle: 'Một không gian riêng tư cho những suy nghĩ và cảm xúc của bạn.',
    todaysEntry: 'Ghi chép hôm nay',
    placeholder: 'Bạn đang nghĩ gì...?',
    save: 'Lưu',
    pastEntries: 'Các ghi chép cũ',
    noEntries: 'Bạn chưa có ghi chép nhật ký nào.',
  },
  tests: {
    title: 'Bài kiểm tra tự đánh giá',
    subtitle: 'Hiểu rõ hơn về sức khỏe tinh thần của bạn bằng thang đo DASS-21.',
    dass21: {
      title: 'Thang đo Trầm cảm, Lo âu và Căng thẳng - 21 mục (DASS-21)',
      instruction: 'Vui lòng đọc từng câu và khoanh tròn một số 0, 1, 2 hoặc 3 cho biết mức độ câu đó áp dụng với bạn trong tuần qua. Không có câu trả lời đúng hay sai. Đừng dành quá nhiều thời gian cho bất kỳ câu nào.',
      questions: [
        { text: "Tôi thấy khó thư giãn", scale: 'S' },
        { text: "Tôi nhận thấy miệng mình bị khô", scale: 'A' },
        { text: "Tôi dường như không thể trải nghiệm bất kỳ cảm giác tích cực nào", scale: 'D' },
        { text: "Tôi bị khó thở (ví dụ: thở quá nhanh, hụt hơi khi không gắng sức)", scale: 'A' },
        { text: "Tôi thấy khó bắt đầu để làm việc gì đó", scale: 'D' },
        { text: "Tôi có xu hướng phản ứng thái quá với các tình huống", scale: 'S' },
        { text: "Tôi bị run (ví dụ: ở tay)", scale: 'A' },
        { text: "Tôi cảm thấy mình đang sử dụng rất nhiều năng lượng thần kinh", scale: 'S' },
        { text: "Tôi lo lắng về những tình huống mà tôi có thể hoảng sợ và làm mình trở nên ngớ ngẩn", scale: 'A' },
        { text: "Tôi cảm thấy mình không có gì để mong đợi", scale: 'D' },
        { text: "Tôi thấy mình trở nên kích động", scale: 'S' },
        { text: "Tôi thấy khó thư giãn", scale: 'S' },
        { text: "Tôi cảm thấy chán nản và buồn bã", scale: 'D' },
        { text: "Tôi không khoan dung với bất cứ điều gì ngăn cản tôi làm những gì tôi đang làm", scale: 'S' },
        { text: "Tôi cảm thấy mình sắp hoảng loạn", scale: 'A' },
        { text: "Tôi không thể nhiệt tình với bất cứ điều gì", scale: 'D' },
        { text: "Tôi cảm thấy mình không có giá trị như một người", scale: 'D' },
        { text: "Tôi cảm thấy mình khá nhạy cảm", scale: 'S' },
        { text: "Tôi nhận thức được hoạt động của tim mình khi không gắng sức (ví dụ: cảm giác tim đập nhanh, tim lỡ nhịp)", scale: 'A' },
        { text: "Tôi cảm thấy sợ hãi vô cớ", scale: 'A' },
        { text: "Tôi cảm thấy cuộc sống vô nghĩa", scale: 'D' },
      ],
      options: [
        "Hoàn toàn không áp dụng với tôi",
        "Áp dụng với tôi ở một mức độ nào đó, hoặc đôi khi",
        "Áp dụng với tôi ở mức độ đáng kể, hoặc phần lớn thời gian",
        "Áp dụng với tôi rất nhiều, hoặc hầu hết thời gian",
      ],
      severity: {
        depression: [
            { level: 'Bình thường', range: [0, 9], color: 'bg-green-500' },
            { level: 'Nhẹ', range: [10, 13], color: 'bg-yellow-400' },
            { level: 'Vừa', range: [14, 20], color: 'bg-orange-500' },
            { level: 'Nặng', range: [21, 27], color: 'bg-red-500' },
            { level: 'Rất nặng', range: [28, 999], color: 'bg-red-700' },
        ],
        anxiety: [
            { level: 'Bình thường', range: [0, 7], color: 'bg-green-500' },
            { level: 'Nhẹ', range: [8, 9], color: 'bg-yellow-400' },
            { level: 'Vừa', range: [10, 14], color: 'bg-orange-500' },
            { level: 'Nặng', range: [15, 19], color: 'bg-red-500' },
            { level: 'Rất nặng', range: [20, 999], color: 'bg-red-700' },
        ],
        stress: [
            { level: 'Bình thường', range: [0, 14], color: 'bg-green-500' },
            { level: 'Nhẹ', range: [15, 18], color: 'bg-yellow-400' },
            { level: 'Vừa', range: [19, 25], color: 'bg-orange-500' },
            { level: 'Nặng', range: [26, 33], color: 'bg-red-500' },
            { level: 'Rất nặng', range: [34, 999], color: 'bg-red-700' },
        ],
        unknown: 'Không rõ'
      }
    },
    errors: {
        incomplete: 'Vui lòng trả lời tất cả các câu hỏi trước khi xem kết quả.'
    },
    viewResults: 'Xem kết quả của tôi',
    results: {
        title: 'Kết quả DASS-21 của bạn',
        date: 'Bài kiểm tra hoàn thành vào: {{date}}',
        disclaimer: 'Tuyên bố miễn trừ trách nhiệm: Đây không phải là một công cụ chẩn đoán. Những kết quả này chỉ mang tính thông tin và không nên được coi là thay thế cho lời khuyên, chẩn đoán hoặc điều trị y tế chuyên nghiệp. Nếu bạn lo lắng về sức khỏe tinh thần của mình, vui lòng tham khảo ý kiến của nhà cung cấp dịch vụ chăm sóc sức khỏe có trình độ.',
        depression: 'Trầm cảm',
        anxiety: 'Lo âu',
        stress: 'Căng thẳng'
    },
    retake: 'Làm lại bài kiểm tra'
  },
  chatbot: {
    title: 'Trò chuyện với Resi',
    subtitle: 'Trợ lý AI cá nhân của bạn để được hướng dẫn và hỗ trợ.',
    error: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
    apiKeyError: 'Dịch vụ AI chưa được cấu hình. Quản trị viên cần cài đặt API key để chatbot có thể hoạt động.',
    welcome: "Xin chào! Tôi là Resi, trợ lý AI thân thiện của bạn. Hôm nay bạn cảm thấy thế nào? Bạn có thể nói chuyện với tôi về bất cứ điều gì trong tâm trí bạn.",
    placeholder: 'Nhập tin nhắn của bạn ở đây...',
  },
  forum: {
    title: 'Diễn đàn cộng đồng',
    subtitle: 'Kết nối với những người khác trên một hành trình tương tự.',
    createPost: 'Tạo bài viết mới',
    discussions: 'Thảo luận',
    postBy: 'Bởi {{author}} vào {{date}}',
    noPosts: 'Chưa có bài viết nào. Hãy là người đầu tiên bắt đầu một cuộc thảo luận!',
    modal: {
      title: 'Tạo một bài viết mới',
      postTitle: 'Tiêu đề',
      content: 'Nội dung',
      cancel: 'Hủy bỏ',
      post: 'Đăng',
    },
  },
  resources: {
    title: 'Tài nguyên sức khỏe',
    subtitle: 'Một thư viện được tuyển chọn gồm các bài viết, video và công cụ hữu ích.',
    noResourcesTitle: 'Không có tài nguyên nào',
    noResourcesDesc: 'Quản trị viên chưa thêm bất kỳ tài nguyên nào. Vui lòng kiểm tra lại sau.',
  },
  dashboard: {
    title: 'Bảng điều khiển của tôi',
    subtitle: 'Theo dõi tiến trình của bạn và ăn mừng sự phát triển của bạn.',
    completed: 'Đã hoàn thành',
    missed: 'Đã bỏ lỡ',
    completedChallenges: 'Thử thách đã hoàn thành',
    journalEntries: 'Ghi chép nhật ký',
    currentStreak: 'Chuỗi hiện tại',
    days: 'ngày',
    latestTestResult: 'Kết quả kiểm tra mới nhất',
    journalChartTitle: 'Ghi chép nhật ký (7 ngày qua)',
    entries: 'Ghi chép',
    challengeChartTitle: 'Hoàn thành thử thách',
  },
  login: {
    error: 'Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại.',
    welcome: 'Chào mừng trở lại',
    subtitle: 'Đăng nhập để tiếp tục hành trình của bạn',
    emailLabel: 'Địa chỉ email',
    passwordLabel: 'Mật khẩu',
    signInButton: 'Đăng nhập',
    noAccount: 'Chưa có tài khoản?',
    signUpLink: 'Đăng ký',
  },
  signup: {
    errorExists: 'Một tài khoản với email này đã tồn tại.',
    errorReserved: 'Địa chỉ email này đã được dành riêng và không thể sử dụng để đăng ký.',
    errorGeneric: 'Không thể tạo tài khoản. Vui lòng thử lại.',
    title: 'Tạo tài khoản',
    subtitle: 'Bắt đầu hành trình khám phá bản thân của bạn ngay hôm nay',
    emailLabel: 'Địa chỉ email',
    passwordLabel: 'Mật khẩu',
    signUpButton: 'Đăng ký',
    hasAccount: 'Đã có tài khoản?',
    signInLink: 'Đăng nhập',
  },
  profile: {
    title: 'Hồ sơ của tôi',
    subtitle: 'Quản lý cài đặt tài khoản của bạn.',
    email: 'Email',
    logoutButton: 'Đăng xuất',
    disclaimer1: 'Đây là một hệ thống xác thực mô phỏng.',
    disclaimer2: 'Dữ liệu người dùng được lưu trữ trong bộ nhớ cục bộ của trình duyệt của bạn.',
  },
  admin: {
    title: 'Bảng quản trị',
    subtitle: 'Quản lý cài đặt ứng dụng và người dùng.',
    users: {
        deleteSelfError: 'Bạn không thể xóa tài khoản quản trị của chính mình.',
        deleteConfirm: 'Bạn có chắc muốn xóa người dùng {{email}} không? Hành động này không thể hoàn tác.',
        title: 'Người dùng ({{count}})',
        email: 'Email',
        role: 'Vai trò',
        delete: 'Xóa',
        admin: 'Quản trị viên',
        user: 'Người dùng'
    },
    forum: {
        deleteConfirm: 'Bạn có chắc muốn xóa bài viết này và tất cả các bình luận của nó không?',
        title: 'Bài viết diễn đàn ({{count}})',
        postTitle: 'Tiêu đề',
        author: 'Tác giả',
        createdAt: 'Ngày tạo',
        delete: 'Xóa'
    },
    resources: {
        addError: 'Tiêu đề và URL/ID YouTube hợp lệ là bắt buộc.',
        title: 'Quản lý video tài nguyên',
        addTitle: 'Thêm video mới',
        videoTitle: 'Tiêu đề video',
        description: 'Mô tả video',
        url: 'URL hoặc ID video YouTube',
        addButton: 'Thêm tài nguyên'
    },
    sounds: {
        addError: 'Tên và URL/ID YouTube hợp lệ là bắt buộc.',
        title: 'Quản lý âm thanh thiên nhiên',
        addTitle: 'Thêm âm thanh mới',
        name: 'Tên / Tiêu đề âm thanh',
        url: 'URL hoặc ID video YouTube',
        addButton: 'Thêm âm thanh'
    },
    knowledge: {
        addError: 'Tiêu đề và nội dung là bắt buộc.',
        deleteConfirm: 'Bạn có chắc muốn xóa tài liệu kiến thức này không?',
        title: 'Quản lý cơ sở kiến thức Chatbot',
        addTitle: 'Thêm tài liệu mới',
        docTitle: 'Tiêu đề tài liệu',
        content: 'Nội dung tài liệu...',
        addButton: 'Thêm tài liệu'
    },
    tabs: {
        users: 'Người dùng',
        forum: 'Diễn đàn',
        chatLogs: 'Nhật ký Chatbot',
        chatKnowledge: 'Kiến thức Chatbot',
        resources: 'Tài nguyên',
        sounds: 'Âm thanh thiên nhiên',
    },
    chatLogs: {
        transcriptTitle: 'Bản ghi cuộc trò chuyện',
        transcriptInfo: 'Người dùng: {{email}} | Phiên: {{date}}',
        close: 'Đóng',
        title: 'Phiên trò chuyện ({{count}})',
        messages: '{{count}} tin nhắn'
    }
  },
  post: {
    deletePostConfirm: 'Bạn có chắc muốn xóa bài viết này và tất cả các bình luận của nó không?',
    deleteCommentConfirm: 'Bạn có chắc muốn xóa bình luận này không?',
    notFound: 'Không tìm thấy bài viết hoặc đang tải...',
    backToForum: 'Trở lại diễn đàn',
    commentsTitle: 'Bình luận ({{count}})',
    leaveComment: 'Để lại bình luận',
    commentPlaceholder: 'Chia sẻ suy nghĩ của bạn...',
    postComment: 'Đăng bình luận',
    noComments: 'Chưa có bình luận nào.',
  },
};

// Define the shape of the context
interface LanguageContextType {
  language: 'en' | 'vi';
  setLanguage: (lang: 'en' | 'vi') => void;
  t: (key: string, options?: any) => any;
}

// Define the translations object structure
const translations: { [key: string]: any } = { en, vi };

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create a custom hook for using the context
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// Create the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<'en' | 'vi'>('language', 'en');

  const t = useCallback((key: string, options?: any): any => {
    const findTranslation = (langObj: any, keyString: string) => {
        const keys = keyString.split('.');
        let result = langObj;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null;
            }
        }
        return result;
    }
    
    let result = findTranslation(translations[language], key);

    // Fallback to English if key not found in current language
    if (result === null) {
        result = findTranslation(translations['en'], key);
    }
    
    // If still not found, return the key itself
    if (result === null) {
        return key;
    }
    
    if (options?.returnObjects) {
        return result;
    }

    if (typeof result === 'string') {
        // Simple interpolation
        if (options) {
            Object.keys(options).forEach(optKey => {
                const regex = new RegExp(`{{${optKey}}}`, 'g');
                result = result.replace(regex, options[optKey]);
            });
        }
        return result;
    }

    return result;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};