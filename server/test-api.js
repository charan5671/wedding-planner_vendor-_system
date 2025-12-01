

const API_URL = 'http://localhost:3000/api';

async function testChatAPI() {
    console.log('🧪 Testing Chat API...');

    const senderId = 'user1';
    const receiverId = 'vendor1';
    const text = 'Hello from test script!';

    // 1. Send Message
    try {
        console.log('1. Sending message...');
        const sendRes = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderId, receiverId, text })
        });

        if (sendRes.ok) {
            const msg = await sendRes.json();
            console.log('✅ Message sent successfully:', msg);
        } else {
            console.error('❌ Failed to send message:', sendRes.status);
        }

        // 2. Get History
        console.log('2. Retrieving chat history...');
        const historyRes = await fetch(`${API_URL}/messages/${senderId}/${receiverId}`);

        if (historyRes.ok) {
            const history = await historyRes.json();
            const found = history.find(m => m.text === text);
            if (found) {
                console.log('✅ Message found in history:', found);
                console.log('🎉 Chat API Verification PASSED!');
            } else {
                console.error('❌ Message NOT found in history.');
            }
        } else {
            console.error('❌ Failed to get history:', historyRes.status);
        }

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
    }
}

testChatAPI();
