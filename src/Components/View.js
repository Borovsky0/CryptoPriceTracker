import React from 'react';

export const View = ({ activePanel, children }) => {
  return (
    <>
      {children.find(child => child.props.id === activePanel)}
    </>
  );
};