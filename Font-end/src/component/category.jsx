import React from 'react'
import './componentcss/category.css'
import allcategory from './categoryAssets/allcategory.png'
import tops from './categoryAssets/tops.png'
import bottoms from './categoryAssets/bottoms.png'
import accessories from './categoryAssets/accessories.png'
import fullBody from './categoryAssets/fullBody.png'
import hats from './categoryAssets/hats.png'
import swimwear from './categoryAssets/swimwear.png'
import shoes from './categoryAssets/shoes.png'

function Category() {


  return (
    <div className='category'>
        <h1>Shop by category</h1>
        <ul>
          <li>
            <div className='cateimg'>
              <a href='/allcate'><img src={allcategory} ></img></a>
              <a href='/top'><img src={tops}></img></a>
              <a href='/bottom'><img src={bottoms}></img></a>
              <a href='/fullBody'><img src={fullBody}></img></a>
            </div>
          </li>
          <li>
            <div className='cateimg'>
              <a href='/accessory'><img src={accessories}></img></a>
              <a href='/hat'><img src={hats}></img></a>
              <a href='/shoe'><img src={shoes}></img></a>
              <a href='/swimwear'><img src={swimwear}></img></a>
            </div>
          </li>
        </ul>
        
    </div>
  )
}

export default Category