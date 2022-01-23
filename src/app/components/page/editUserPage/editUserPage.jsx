import React, { useEffect, useState } from "react";
import { validator } from "../../../utils/ validator";
import PropTypes from "prop-types";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radio.Field";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useProfessions } from "../../../hooks/useProfession";
import { useQualities } from "../../../hooks/useQualities";
import { useAuth } from "../../../hooks/useAuth";

const EditUserPage = () => {
    const { updateUser, currentUser } = useAuth();
    const { professions } = useProfessions();
    const { qualities } = useQualities();
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(currentUser);
    const professionsList = professions.map((p) => ({
        label: p.name,
        value: p._id
    }));
    const qualitiesList = qualities.map((q) => ({
        label: q.name,
        value: q._id
    }));

    useEffect(() => {
        if (professionsList && qualitiesList) {
            // setData(currentUser);
            setIsLoading(false);
        }
    }, [currentUser]);

    const getQualities = (elements) => {
        if (elements) {
            const qualitiesArray = [];
            for (const elem of elements) {
                for (const qual in qualitiesList) {
                    if (elem === qualitiesList[qual].value) {
                        qualitiesArray.push(qualitiesList[qual]);
                    }
                }
            }
            return qualitiesArray;
        }
    };

    const userQualities = getQualities(data.qualities);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const { qualities } = data;
        try {
            await updateUser({
                ...data,
                qualities: qualities.map((q) => q.value)
            });
        } catch (error) {
            setErrors(error);
        }
    };

    const validatorConfg = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },

        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };
    useEffect(() => validate(), [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfg);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {currentUser && !isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                name="profession"
                                options={professionsList}
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={userQualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

EditUserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default EditUserPage;
