import {
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Chat.css";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useHistory } from "react-router";
import { user } from "../../reducers/authReducers";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../../firebase-config";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ChatPanel from "../../components/ChatPanel/ChatPanel";
import { changeUser } from "../../reducers/chatReducers";

const Chat: React.FC = () => {
  const history = useHistory();

  const [chats, setChats] = useState<any>();
  const currentUser = useAppSelector(user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) {
      history.push("/login");
    }

    try {

      const getChats = () => {
        setLoading(true);
  
        onSnapshot(doc(db, "userChats", currentUser.id), (doc) => {
          setChats(doc.data());
          setLoading(false);
        });
        // const unsub =
        // return () => {
        //   unsub();
        // };
      };
       getChats();
      
    } catch (error) {
       console.log(error)
    }
    
  }, [currentUser, history]);

  const handleSelect = (selectedUser: any) => {
    dispatch(changeUser({ user: selectedUser, currentUser: currentUser }));
    history.push("/chat-screen");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        {chats && (
          <List
            sx={{ width: 444, maxWidth: "100%", bgcolor: "background.paper" }}
          >
            {loading ? <IonSpinner> </IonSpinner> : Object.entries(chats)
              ?.sort((a: any, b: any) => b[1].date - a[1].date)
              .map((chat: any) => (
                <ListItem
                  onClick={() => handleSelect(chat[1].userInfo)}
                  key={chat[0]}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <img src={chat[1].userInfo.profileImg} alt="" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat[1].userInfo.displayName}
                    secondary={chat[1].lastMessage?.text}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Chat;
