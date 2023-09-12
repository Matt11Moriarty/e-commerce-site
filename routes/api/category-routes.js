const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  const categoryData = await Category.findAll();
  return res.json(categoryData)
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id);
    if (!categoryData) {
      res.status(404).json({message: 'No category with this id!'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json({message: `Category id:${categoryData.id} created.`})
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id);
    if (!categoryData) {
      res.status(404).json({message: 'No category with this id!'});
      return;
    }

    const [changedRows] = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (changedRows != 1) {
      res.status(404).json({message: 'No changes made'})
      return;
    }

    res.status(200).json({message: `Category name updated to ${req.body.category_name}`})
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const {category_name} = await Category.findByPk(req.params.id)
    const deletedRows = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!deletedRows) {
      res.status(404).json({message: 'No category with this id'});
      return;
    }
    res.status(200).json({message: `Deleted the ${category_name} category`});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
