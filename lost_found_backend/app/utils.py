# app/utils.py
def to_dict_with_extras(model_obj, extras: dict = None):
    data = {k:v for k,v in model_obj.__dict__.items() if not k.startswith("_")}
    if extras:
        data.update(extras)
    return data
