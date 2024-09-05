import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'

const Form = ({ formId, taskForm, users}) => {
    const router = useRouter();
    console.log(users);
    console.log(taskForm);
    // This is used for managing the local state of the form
    const [form, setForm] = useState({
        name: taskForm.name,
        description: taskForm.description,
        users: taskForm.users,
    });

    // function to handle editing an existing task (PUT)
    // We pass form because this holds the info for the task
    const putData = async (form) => {
        // We get the id of the task we are currently editing for updating DB
        const {id} = router.query;
        // Let's try to hit the API to update the task
        try {
            const res = await fetch(`/api/task/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            // If somethign goes wrong with the response from the API, throw an error
            // if (!res.ok) {
            //     throw new Error('Something went wrong!');
            // }
            const { data } = await res.json();
            mutate(`/api/task/${id}`, data, false);
            router.push('/')
        } catch (error) {
            
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        putData(form);
    }

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setForm({
            ...form,
            [name]: value  
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="name" 
                value={form.name}
                onChange={handleChange}>
                
            </input>
            <input 
                type="text" 
                name="description" 
                value={form.description}
                onChange={handleChange}>
                
            </input>
            <select name="users" onChange={handleChange}>
                {users.map((user) => {
                    return <option key={user.id} value={user.id}>{user.firstName + ' ' + user.lastName}</option>
                })}
            </select>
            <button type="submit">Submit</button>

        </form>
    )
}

export default Form;