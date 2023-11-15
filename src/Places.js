import './Places.css'
import { useLocation } from 'react-router-dom';
import React from 'react'

function Places() {
  const location = useLocation();
  const nepaliData = location.state ? location.state.nepaliData : null;
  return (
  
    <div className='places-container'>
      

      <div className='header'>
        <select id="municipality-unique" value={nepaliData}>
          <option value="">All Palika</option>
          <option value="Bungal">बुङ्गल नगरपालिका</option>
          <option value="Bitthadchir">बित्थडचिर गाँउपालिका</option>
          <option value="Chhabispathibhera">छबिसपाथिभेरा गाँउपालिका</option>
          <option value="Durgathali">दुर्गाथली गाँउपालिका</option>
          <option value="Jayaprithvi">जयपृथ्वी नगरपालिका</option>
          <option value="Saipal">सइपाल गाउपालिका</option>
          <option value="Kedarsyun">केदारस्युँ गाँउपालिका</option>
          <option value="Khaptadchhanna">खप्तडछान्ना गाउँपालिका</option>
          <option value="Mastha">मष्टा गाउँपालिका</option>
          <option value="Surma">सूर्मा गाउँपालिका</option>
          <option value="Talakot">तलकोट गाँउपालिका</option>
          <option value="Thalara">थलारा गाउँपालिका</option>
        </select>
      </div>
      
      
    <div className='places-list'>
      <div className='place-container'>
        <div className='place-title'>Shaileshwori Temple</div>
        <div className='image-container'>
          <img src='' alt='Place Image' />
        </div>
        <div className='place-control'>
        <button id='share'><i class="fas fa-share"></i></button>
          <button id='expand'><i class="fas fa-expand"></i></button>
        </div>
        <div className='place-description'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam alias tenetur eum, ipsa corporis illo recusandae fugiat sapiente neque reiciendis quia ullam. Sint ex sed facilis deleniti consectetur quo consequatur eveniet? Quas deleniti fuga, vero blanditiis saepe culpa, hic eum ea iste dolorem minus incidunt, nihil sit quisquam earum aliquam ratione aperiam unde laborum nesciunt? Laborum dolor ipsam quas aliquam laudantium deleniti magni cupiditate fugiat doloremque repellat vero, earum obcaecati temporibus quos consequatur deserunt dolores est, inventore doloribus culpa assumenda quidem laboriosam similique. Enim natus voluptates autem vel non explicabo sequi iste repellat aliquid nihil adipisci eveniet molestiae veniam corrupti, dolores eius quaerat inventore nam vitae tempore officia. Vitae explicabo autem libero eaque illo vel temporibus. Deserunt dolores porro sed.
        </div>
      </div>
      <div className='place-container'>
        <div className='place-title'>Shaileshwori Temple</div>
        <div className='image-container'>
          <img src='' alt='Place Image' />
        </div>
        <div className='place-control'>
          <button id='share'><i class="fas fa-share"></i></button>
          <button id='expand'><i class="fas fa-expand"></i></button>
        </div>
        <div className='place-description'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus soluta nemo dicta eius adipisci doloribus laboriosam eos? Nesciunt, fugit. Soluta dicta adipisci autem beatae reiciendis fuga sapiente, dolorum explicabo. Ea eligendi quasi dicta error ducimus, quos fugiat assumenda amet velit ex porro in, placeat doloribus iusto rem facere odio? Illum impedit, officia consequuntur reprehenderit ratione natus reiciendis dolorem, est assumenda illo perspiciatis eum dolor culpa quisquam sit iusto! Praesentium adipisci earum hic enim voluptatum et, voluptates eius deleniti velit nulla similique laborum. Voluptatem unde pariatur magni, sequi temporibus commodi nesciunt hic libero laborum autem neque corporis doloremque iusto saepe sed exercitationem rerum culpa minus aspernatur obcaecati placeat ad repudiandae magnam. Molestias excepturi reprehenderit perferendis soluta numquam? Et laboriosam quibusdam esse.
        </div>
      </div>
      
     
      {/* <!-- Repeat this structure for other places --> */}
  
      {/* <!-- Pagination --> */}
     
    <div class='pagination'>
      <button>&laquo; Prev</button>
      <span class='current-page'>1</span>
      <button>Next &raquo;</button>
    </div>
    </div>
  </div>
  
   
  )
}

export default Places
