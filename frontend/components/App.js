import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import { axiosWithAuth } from "../axios";
import PrivateRoute from "./PrivateRoute";
const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.clear();
    redirectToLogin();
    setMessage("Goodbye!");
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, {
        username: username,
        password: password,
      })
      .then((res) => {
        const { message, token } = res.data;
        setMessage(message);
        localStorage.setItem("token", token);
        redirectToArticles();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        const { message, articles } = res.data;
        setArticles(articles);
        setMessage(message);
      })
      .catch((err) => {
        console.error(err);
        redirectToLogin();
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        const { message, article } = res.data;
        setMessage(message);
        setArticles([...articles, article]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!

    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((res) => {
        const { message, article } = res.data;
        const UnEditedState = articles.filter((each) => {
          if (each.article_id !== article_id) {
            return each;
          }
        });
        setArticles([article, ...UnEditedState]);
        setMessage(message);
      })
      .catch((err) => {
        console.error(err.response.data.message);
        setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
        setCurrentArticleId();
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((res) => {
        const NotCurrentArticle = articles.filter((each) => {
          if (each.article_id !== article_id) {
            return each;
          }
        });
        setArticles(NotCurrentArticle);
        const { message } = res.data;
        setMessage(message);
      })
      .catch((err) => {
        getArticles();
        console.log(err);
      });
  };

  const currentArticle = articles.filter((each) => {
    return each.article_id === currentArticleId;
  });

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <PrivateRoute>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                  currentArticle={currentArticle[0]}
                  getArticles={getArticles}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                  setArticles={setArticles}
                />
              </PrivateRoute>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
