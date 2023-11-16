import React, { useEffect, useState } from 'react';
import './Requests.css';
import { useNavigate } from 'react-router-dom';

function Requests() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API only if the user token exists
    const userToken = localStorage.getItem('authToken');

    if (userToken) {
      const fetchData = async () => {
        try {
          // Fetch user information from the 'users/me' endpoint
          const userResponse = await fetch('http://127.0.0.1:2500/auth/users/me/', {
            headers: {
              Authorization: `Token ${userToken}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            const username = userData.username;

            // Fetch requests filtered by the username
            const requestsResponse = await fetch(`http://127.0.0.1:2500/api/relief_request/${username}/`, {
              headers: {
                Authorization: `Token ${userToken}`,
              },
            });

            if (requestsResponse.ok) {
              const jsonData = await requestsResponse.json();
              setData(jsonData);
            } else {
              setError('Error fetching data. Please try again later.');
              console.error('Error fetching data:', requestsResponse.statusText);
            }
          } else {
            setError('Error fetching user data. Please try again later.');
            console.error('Error fetching user data:', userResponse.statusText);
          }
        } catch (error) {
          setError('Error fetching data. Please try again later.');
          console.error('Error fetching data:', error.message);
        }
      };

      fetchData();
    } else {
      navigate('/Log-in');
    }
  }, []); // The empty dependency array ensures that the effect runs only once on component mount

  // Pagination variables and functions
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    // Handle page change logic here
    console.log(`Selected Page: ${selectedPage}`);
  };

  return (
    <div className="requests-table">
      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : (
        <>
          {data.length === 0 ? (
            <div className="no-requests-message">
              No relief requests so far
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Citizenship No</th>
                    <th>House No</th>
                    <th>Disaster</th>
                    <th>Ward</th>
                    <th>Location</th>
                    <th>Requested Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>{item.citizenship_no}</td>
                      <td>{item.House_no}</td>
                      <td>{item.disaster}</td>
                      <td>{item.ward}</td>
                      <td>{item.location}</td>
                      <td>{item.uploaded_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button key={index} onClick={() => handlePageClick(index + 1)}>
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Requests;
