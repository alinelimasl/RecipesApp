type PropsType = {
  index: number
  image: string
  name: string
};

function Recommendations({ index, image, name }: PropsType) {
  return (
    <div
      className="recommendation-card"
      data-testid={ `${index}-recommendation-card` }
    >
      <img
        src={ image }
        alt="imagem da receita"
      />
      <p data-testid={ `${index}-recommendation-title` }>{name}</p>
    </div>
  );
}

export default Recommendations;
