import Head from 'next/head';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';

import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';

import { db, auth } from '../../firebase';
import { firestore } from '../../firebase-admin';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>{getRecipientEmail(chat.users, user)} chat</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {

  const ref = firestore.collection('chats').doc(context.query.id);
  const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();
  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(), // it's because we lost it
    }));
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      chat: chat,
      messages: JSON.stringify(messages), // use stringify because if a complex object
    },
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
