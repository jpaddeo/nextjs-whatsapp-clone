import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { Avatar, Button, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db, auth } from '../firebase';
import Chat from './Chat';

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const userChatReference = db
    .collection('chats')
    .where('users', 'array-contains', user.email);
  const [chatsSnapshot] = useCollection(userChatReference);
  const createNewChat = () => {
    const input = prompt(
      'Please enter an email address for ther user you wish chat with'
    );
    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // TODO validate thats input email exists on DB
      db.collection('chats').add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recepientEmail) => {
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recepientEmail)?.length > 0
    );
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.singOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder='Search in chats' />
      </Search>
      <NewChatButton onClick={createNewChat}>Start new chat</NewChatButton>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;
const NewChatButton = styled(Button)`
  width: 100%;
  &&& {
    /* &&& increase the priority of this block */
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
