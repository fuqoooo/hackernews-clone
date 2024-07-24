import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState} from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";

interface submitNewsData {
    title: string;
    url: string;
    description: string;
}

export const CreateForm = () => {

const [user] = useAuthState(auth);
const navigate = useNavigate();

const schema = yup.object().shape({
title: yup.string().required("You must add a title."),
url: yup.string().required("You must add a url."),
description: yup.string().required("You must add a description."),
});

const { register, handleSubmit, formState: {errors} } = useForm<submitNewsData>({
resolver: yupResolver(schema),
});

const [totalPosts, setTotalPosts] = useState<number>(0);

useEffect(() => {
    const fetchTotalPosts = async () => {
        const postsSnapshot = await getDocs(collection(db, "posts"));
        setTotalPosts(postsSnapshot.size);
    };
    fetchTotalPosts();
}, []);

const postsRef = collection(db, "posts");

const onsubmitNews = async (data: submitNewsData) => {

    const postNumber = totalPosts + 1;

await addDoc(postsRef, {
    ...data,
    username: user?.displayName,
    userId: user?.uid,
    postNumber: postNumber,
})

navigate("/");
};

return (
   <div className="form-container">
 <table>
   <tr>
        <td>
        <form onSubmit={handleSubmit(onsubmitNews)}>
    <label>title</label>
    <input {...register("title")} className="submitInfo"/>
    <p style={{color: "red"}}> {errors.title?.message} </p>
    <label>url</label>
    <input  {...register("url")} className="submitInfo" />
    <p style={{color: "red"}}> {errors.url?.message} </p>
    <label>text</label>
    <textarea {...register("description")} className="submitInfo" />
    <p style={{color: "red"}}> {errors.description?.message} </p>
    <input type="submit" />
</form>
        </td>
    </tr>
    </table>
   </div> 
   
 

);
};