import React from 'react'

export default async function Page({params}:{params:Promise<{Id:string}>}){
    const name = (await params).Id
  return (
    <div>{name}</div>
  )
}

