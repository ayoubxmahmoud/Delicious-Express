import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import {toast} from 'react-toastify' // Importing toast from displaying notifications


const List = ({url}) => {
  // State to store the list of items fetched from the server
  const [list, setList] = useState([])
  // Base URL for the API


  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`); // Sending GET request to fetch data
    if(response.data.success) {
      setList(response.data.foods); // Updating the state with the fetched data
    }else{
      toast.error("Error on fetching data!"); // Displaying an error message if the request fails
    }
  }
  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {id:foodId});
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }else{
      toast.error("Error occured when removing food item")
    }
  }
  // hook to call fetchList when the component mounts once
  useEffect(() => {
    fetchList();
  },[])
  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
