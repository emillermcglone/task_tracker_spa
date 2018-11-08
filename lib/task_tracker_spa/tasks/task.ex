defmodule TaskTrackerSpa.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset


  schema "tasks" do
    field :completed, :boolean, default: false
    field :description, :string
    field :time, :integer
    field :title, :string
    belongs_to :user, TaskTrackerSpa.Users.User
    

    timestamps()
  end

  #check if time is in an increment of 15 
  def validate_time(changeset, field) do 
    time = get_field(changeset, field)
    if time == nil || rem(time, 15) == 0 do 
      changeset
    else
      add_error(changeset, :time, "Time must be an increment of 15") 
    end
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :description, :time, :completed, :user_id])
    |> validate_required([:title, :description, :time, :completed, :user_id])
    |> validate_time(:time)
  end
end
