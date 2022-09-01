from datetime import datetime


class User:

    def __init__(self, username: str, password: str, email: str) -> None:
        self.user_projects = []
        self.username = username
        self.password = password
        self.email = email

    def build_dict(self) -> dict:
        return {
            "username": self.username,
            "password": self.password,
            "email": self.email,
            "user_projects": self.user_projects,
        }

    def add_project(self, project: dict) -> None:
        self.user_projects.append(project)


class Project:

    def __int__(self,):
        self.project_orm = {
            "p_name": "",
            "obj": "",
            "goal": 0.00,
            "num_steps_total": 0,
            "num_steps_completed": 0,
            "single_step_value": 0.00,
            "due_date": datetime.utcnow(),
            "time_left": 0,
            "perc_compl": 0.00,
            "description": "",
            "p_id": "",
        }

    def set_project_name(self, name: str) -> None:
        self.project_orm["p_name"] = name

    def set_obj(self, obj: str) -> None:
        self.project_orm["obj"] = obj

    def set_goal(self, goal: float) -> None:
        self.project_orm["goal"] = goal

    def set_num_steps_total(self, num_steps_total: int) -> None:
        self.project_orm["num_steps_total"] = num_steps_total

    def set_num_steps_completed(self, num_steps_completed: int) -> None:
        self.project_orm["num_steps_completed"] = num_steps_completed

    def set_single_step_value(self, single_step_value: float) -> None:
        self.project_orm["single_step_value"] = single_step_value

    def set_due_date(self, due_date: datetime) -> None:
        self.project_orm["due_date"] = due_date

    def set_time_left(self, time_left: int) -> None:
        self.project_orm["time_left"] = time_left

    def set_perc_compl(self, perc_compl: float) -> None:
        self.project_orm["perc_compl"] = perc_compl

    def set_description(self, description: str) -> None:
        self.project_orm["description"] = description

    def set_p_id(self, p_id: str) -> None:
        self.project_orm["p_id"] = p_id

    def get_dict(self) -> dict:
        return self.project_orm
