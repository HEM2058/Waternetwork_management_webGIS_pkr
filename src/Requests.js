import React, { useEffect, useState } from 'react';
import './Requests.css';
import { useNavigate } from 'react-router-dom';

function Requests() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem('authToken');

    if (userToken) {
      const fetchData = async () => {
        try {
          const userResponse = await fetch('http://127.0.0.1:2500/auth/users/me/', {
            headers: {
              Authorization: `Token ${userToken}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            const username = userData.username;

            const requestsResponse = await fetch(`http://127.0.0.1:2500/api/relief_request/${username}/?page=${currentPage}`, {
              headers: {
                Authorization: `Token ${userToken}`,
              },
            });

            if (requestsResponse.ok) {
              const jsonData = await requestsResponse.json();
              setData(jsonData.results);
                // Calculate total pages based on count and items per page
            setTotalPages(Math.ceil(jsonData.count / 5));
              console.log(jsonData);

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


  }, [currentPage]);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
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
                    <th>Reference</th>
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
                      <td className='img-link'>
        <a href={item.img} target="_blank" rel="noopener noreferrer">
        Image
        </a>
      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
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
