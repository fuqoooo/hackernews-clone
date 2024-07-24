import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { Post as InterfacePost } from "./main";
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Props {
    post: InterfacePost;
}

interface Like {
    userId: string;
    likeId: string;
}

export const Post = (props: Props) => {
    const {post} = props
    const [user] = useAuthState(auth);

    const [Like, setLike] = useState<Like[] | null>(null)

    const likesRef = collection(db, "likes");

    const getLikes = async () => {
       const data = await getDocs(likesDoc);
       setLike(data.docs.map((doc) => ({userId: doc.data().userId, likeId: doc.id })));
       
    };
    const addLike = async () => {
        try {
    const newDoc = await addDoc(likesRef, { userId: user?.uid , postId: post.id } );
    if (user) {
    setLike((prev) => prev ? [...prev, {userId: user?.uid, likeId: newDoc.id}] : [{userId: user?.uid, likeId: newDoc.id}])
        };
        } catch (err) {
            console.log(err);
            
        }
    };

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(likesRef, where("postId", "==", post.id), where("userId", "==", user?.uid) );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id
           const likeToDelete = doc(db, "likes", likeId)
    await deleteDoc(likeToDelete);
    if (user) {
    setLike((prev) => prev && prev.filter((like) => like.likeId !== likeId))
        };
        } catch (err) {
            console.log(err);
            
        }
    };

    const hasUserLiked = Like?.find((like) => like.userId === user?.uid );

    const likesDoc = query(likesRef, where("postId", "==", post.id) );

    useEffect(() => {
        getLikes();
    }, []);

    return <div>

        <div className="post-top">
            <p> {post.postNumber}. </p>
            <button onClick={hasUserLiked ? removeLike : addLike} >{ hasUserLiked ? <>&#9660;</> : <>&#9650;</> }</button>
            <a href={post.url} className="title"> <h1 className="title"> {post.title} </h1> </a> 
            <a href={post.url} className="url" > <p> ({post.url})  </p> </a> 
            
        </div>

        <div className="post-bottom">
            <h1 className="description">{Like?.length} points by {post.username} | {post.description} </h1>
        </div>

    </div>
};

