defmodule TaskTrackerSpaWeb.SessionController do

    use TaskTrackerSpaWeb, :controller

     action_fallback TaskTrackerSpaWeb.FallbackController

     alias TaskTrackerSpa.Users.User

     def create(conn, %{"email" => email, "password" => password}) do
      with %User{} = user <- TaskTrackerSpa.Users.get_and_auth_user(email, password) do
        resp = %{
          data: %{
            token: Phoenix.Token.sign(TaskTrackerSpaWeb.Endpoint, "user_id", user.id),
            user_id: user.id,
          }
        }

         conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(resp))
      end
    end
  end 