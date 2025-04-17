'use client'
import React from 'react';

export default function CardLayout (props: any) {

  return (
    <div
      style={{
        display:props.display,
        alignItems: props.alignItems,
        justifyContent: props.justifyContent,
        backgroundColor: props.backgroundColor,
        marginBottom: props.marginBottom,
        margin: props.margin,
        border: props.border,
        height: props.height,
        padding: props.padding,
        width: props.width,
        marginTop: props.marginTop,
        borderRadius: props.borderRadius,
        boxShadow: props.boxShadow,
        backgroundImage: props.backgroundImage,
        fontSize: props.fontSize
      }}
      onClick={props.handleSubmit}
    >
      {props.cardContent}
    </div>
  )
}
