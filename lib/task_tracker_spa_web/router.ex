defmodule TaskTrackerSpaWeb.Router do
  use TaskTrackerSpaWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", TaskTrackerSpaWeb do
    pipe_through :browser # Use the default browser stack
    
    get "/users", PageController, :index
    get "/tasks", PageController, :index
    get "/", PageController, :index
    
  end

  # Other scopes may use custom stacks.
  scope "/api/v1", TaskTrackerSpaWeb do
    pipe_through :api

    resources "/sessions", SessionController, only: [:create]
    
    resources "/users", UserController, except: [:new, :edit]
    resources "/tasks", TaskController, except: [:new, :edit]
    resources "/sessions", SessionController, only: [:create]
  end
end
