import React, { useState, useEffect, useContext } from "react";

import Axios from 'axios';

import useFetch from "../../hooks/useFetch";

import AuthContext from "../../context/AuthContext/AuthContext";
import UserContext from "../../context/UserContext/UserContext";
import DataContext from "../../context/DataContext/DataContext";

import EditIcon from "../../components/EditIcon/EditIcon";
import EditUserProp from "../../components/EditUserProp/EditUserProp";
import BigButton from "../../components/BigButton/BigButton";
import SmallButton from "../../components/SmallButton/SmallButton";

import classes from './Profile.module.css';


const Profile = (props) => {

    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [emailExits, setEmailExits] = useState(false);
    const [imgErr, setImgErr] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    const authCtx = useContext(AuthContext);
    const userCtx = useContext(UserContext);
    const dataCtx = useContext(DataContext)

    const { isLoading, error, sendRequest } = useFetch();

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&§+*=]).{8,}$/;

    useEffect(() => {
        authCtx.checkAuth();

        sendRequest({url:`http://localhost:4000/api/users/${authCtx.user.id}`},
            data => {

                data.img = data.img ?? "1.png";

                const user = {
                    img: data.img === "1.png" ? 
                        data.img : 
                        btoa(new Uint8Array(data.img.img.data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    ),
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                };

                setUserData(user);
            });

        authCtx.user.id === dataCtx.guestID ? setIsGuest(true) : setIsGuest(false);
    }, [sendRequest, authCtx, dataCtx, userCtx]);

    const changePropHandler = async(updatedData) => {
        if("email" in updatedData) {
            let emailStatus;
            await sendRequest({url:`http://localhost:4000/api/users/checkemail/${updatedData.email}`},
            data => emailStatus = data);
            
            if(emailStatus) {
                setEmailExits(true);
                return;
            } else {
                setEmailExits(false);
            };
        };

        setUserData((prevState) => Object.assign(prevState, updatedData));

        sendRequest({
            url:`http://localhost:4000/api/users/${authCtx.user.id}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: updatedData
        },
            data => {
                userCtx.updateUser(userData);
            }
        );

        setIsEditing(null);
    };

    const changePasswordHandler = (updatedPw) => {

        sendRequest({
            url:`http://localhost:4000/api/users/password/${authCtx.user.id}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: updatedPw
        },
            data => null
        );

        localStorage.setItem("user", JSON.stringify(
            {
                _id: authCtx.user.id,
                token: authCtx.user.token, 
                pwLength: updatedPw.password.length
            }
        ));
        authCtx.updatePwLength(updatedPw.password.length);

        setIsEditing(null);
    };

    const changeImgHandler = (files) => {

        setImgErr(null);

        const formData = new FormData();
        formData.append("name", files[0].name);
        formData.append("userImage", files[0]);

        Axios.patch(`http://localhost:4000/api/users/upload/${authCtx.user.id}`, formData).then(response => {
            setImgErr(null);
            setIsEditing(null);
            userCtx.updateUser(
                (prevState) => (
                    {
                        ...prevState,
                        img: btoa(new Uint8Array(response.data.img.img.data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), ''))
                    }
                )
            );
        }).catch(err => {
            setImgErr(err.response.data);
        });
    };

    const deleteUserHandler = () => {
        if(window.confirm("Bist du dir sicher, dass du dein Konto löschen möchtest?")) {
            sendRequest({
                url:`http://localhost:4000/api/users/${authCtx.user.id}`,
                method: "DELETE"
            },
                data => authCtx.logoutUser()
            );
        };
    };

    const stopEditingHandler = () => {
        setIsEditing(null);
        setEmailExits(null);
        setImgErr(null);
    }; 

    return(
        <>
            {isLoading && <p>Profil lädt...</p>}
            {userData && <div className={classes.grid}>
                <header>
                    <div className={classes.imageWrapper}>
                        <img 
                            className={classes.profileImage} 
                            src={userData.img === "1.png" ? 
                                require(`../../assets/members/${userData.img}`) :
                                `data:image/png;base64,${userData.img}`
                            } 
                            onClick={() => 
                                isEditing === "img" ? 
                                stopEditingHandler() : 
                                setIsEditing("img")
                            }
                            alt={`${userData.firstName} ${userData.lastName}`}
                        />
                    </div>
                </header>
                <main>
                    <div className={classes.userProp}>
                        <EditIcon 
                                title="Profilbild" 
                                onClick={() => setIsEditing("img")}
                                editable={isEditing}
                        />
                        {!(isEditing === "img") && 
                            <SmallButton
                                onClick={() => setIsEditing("img")}
                                style={{width: "30%"}}
                            >Ändern
                            </SmallButton>
                        }
                        {isEditing === "img" && 
                            <EditUserProp 
                                prop="img"
                                type="file"
                                validateInput={
                                    (value) => value 
                                }
                                inputErrorText={
                                    <p className={classes.errText}>{imgErr}</p>
                                }
                                onUpdateProp={changeImgHandler}
                                onQuitEdit={stopEditingHandler}
                            />
                        }
                    </div>
                    <div className={classes.userProp}>
                        <EditIcon 
                            title="Vorname" 
                            onClick={() => setIsEditing("firstName")}
                            editable={isEditing}
                            isGuest={isGuest}
                        />
                        {!(isEditing === "firstName") && <span>{userData.firstName}</span>}
                        {isEditing === "firstName" && 
                            <EditUserProp 
                                prop="firstName"
                                initialValue={userData.firstName}
                                maxLength={"30"}
                                validateInput={
                                    (value) => value.trim().match(/^[a-zA-ZäöüÄÖÜß '\s-]{2,}$/)
                                }
                                inputErrorText={
                                    <p className={classes.errText}>Gib bitte einen gültigen Vornamen ein.</p>
                                }
                                onUpdateProp={changePropHandler}
                                onQuitEdit={stopEditingHandler}
                            />
                        }
                    </div>
                    <div className={classes.userProp}>
                        <EditIcon 
                            title="Nachname" 
                            onClick={() => setIsEditing("lastName")}
                            editable={isEditing}
                        />
                        {!(isEditing === "lastName") && <span>{userData.lastName}</span>}
                        {isEditing === "lastName" && 
                            <EditUserProp 
                                prop="lastName"
                                initialValue={userData.lastName}
                                maxLength={"30"}
                                validateInput={
                                    (value) => value.trim().match(/^[a-zA-ZäöüÄÖÜß '\s-]{2,}$/)
                                }
                                inputErrorText={
                                    <p className={classes.errText}>Gib bitte einen gültigen Nachnamen ein.</p>
                                }
                                onUpdateProp={changePropHandler}
                                onQuitEdit={stopEditingHandler}
                            />
                        }
                    </div>
                    <div className={classes.userProp}>
                        <EditIcon 
                            title="E-Mail" 
                            onClick={() => setIsEditing("email")}
                            editable={isEditing}
                            isGuest={isGuest}
                        />
                        {!(isEditing === "email") && <span>{userData.email}</span>}
                        {isEditing === "email" && 
                            <EditUserProp 
                                prop="email"
                                initialValue={userData.email}
                                validateInput={
                                    (value) => value.trim().match(emailRegex) && !emailExits
                                }
                                inputErrorText={emailExits ? 
                                    <p className={classes.errText}>E-Mail-Adresse existiert bereits.</p> : 
                                    <p className={classes.errText}>Gib bitte eine gültige E-Mail-Adresse ein.</p> 
                                }
                                onUpdateProp={changePropHandler}
                                onQuitEdit={stopEditingHandler}
                                onSave={() => setEmailExits(false)}
                            />
                        }
                    </div>
                    <div className={classes.userProp}>
                        <EditIcon 
                            title="Passwort" 
                            onClick={() => setIsEditing("password")}
                            editable={isEditing}
                            isGuest={isGuest}
                        />
                        {!(isEditing === "password") && <span>{"*".repeat(authCtx.user.pwLength)}</span>}
                        {isEditing === "password" && 
                            <EditUserProp 
                                prop="password"
                                initialValue={""}
                                validateInput={
                                    (value) => value.trim().match(pwRegex)
                                }
                                inputErrorText={
                                    <div className={classes.err}>
                                        <p className={classes.errText}>• Klein- und Großbuchstaben</p>
                                        <p className={classes.errText}>• Mind. 8 Zeichen</p>
                                        <p className={classes.errText}>• Mind. 1 Zahl</p>
                                        <p className={classes.errText}>• Mind. 1 Sonderzeichen</p>
                                    </div>
                                }
                                onUpdateProp={changePasswordHandler}
                                onQuitEdit={stopEditingHandler}
                            />
                        }
                    </div>
                </main>
                {error && error}
                <footer>
                    <BigButton
                        onClick={authCtx.logoutUser}
                    >Abmelden</BigButton>
                    {!isGuest &&
                        <BigButton
                            className={classes.deleteBtn}
                            onClick={deleteUserHandler}
                        >Konto Löschen</BigButton>
                    }
                </footer>
            </div>}
        </>
    );
};

export default Profile;