export const products = [
    {
      title: 'Espresso Shot',
      description: 'Rich and bold espresso for coffee lovers.',
      image: 'https://imgs.search.brave.com/aqzRG8Nu7rNdM6LT6x3mqO__PRruR7ST3zI12O9W9NQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vcGhvdG9z/L3R3by1jdXBzLW9m/LWVzcHJlc3NvLXNo/b3Qtd2l0aC1jcmVt/YS1waWN0dXJlLWlk/MTA1NjUzMTIwP2s9/MjAmbT0xMDU2NTMx/MjAmcz02MTJ4NjEy/Jnc9MCZoPXV5b2ZV/N1MyVW5RbF84a1kw/ZjAtUUxZYTVTNjNa/TGJtUnNoOWNLVkMw/d2c9.jpeg',
      category: 'coffee',
      sizes: [
        { id: 'single', name: 'Single', stock: 50, price: 50 },
        { id: 'double', name: 'Double', stock: 30, price: 80 },
        { id: 'triple', name: 'Triple', stock: 20, price: 120 },
      ],
    },
    {
      title: 'Blueberry Muffin',
      description: 'Soft and moist muffin with fresh blueberries.',
      image: 'https://imgs.search.brave.com/knsdbSSHuSHw--IUyzJfaGDMaidYIAiVp-SkIxRhlgo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzQyLzk2LzA1/LzM2MF9GXzg0Mjk2/MDU4NF80dVdmWmo2/SzRFTWRKaldLdkM4/ZDJHRjhrRDFDSXp3/Vy5qcGc',
      category: 'bakery',
      sizes: [
        { id: 'small', name: 'Small', stock: 40, price: 30 },
        { id: 'regular', name: 'Regular', stock: 50, price: 50 },
        { id: 'large', name: 'Large', stock: 20, price: 70 },
      ],
    },
    {
      title: 'Chocolate Cake',
      description: 'Decadent and moist chocolate cake with rich frosting.',
      image: 'https://imgs.search.brave.com/8Y_dGCRjm4Bj57qLyly78Vsw_ZSRJ2Ud7xpZ-hs_w8g/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cmVjaXBldGluZWF0/cy5jb20vdGFjaHlv/bi8yMDE4LzAzL0No/b2NvbGF0ZS1DYWtl/XzEtMS5qcGc',
      category: 'dessert',
      sizes: [
        { id: 'slice', name: 'Slice', stock: 100, price: 60 },
        { id: 'half', name: 'Half Cake', stock: 20, price: 300 },
        { id: 'full', name: 'Full Cake', stock: 10, price: 500 },
      ],
    },
    {
      title: 'Classic Burger',
      description: 'Juicy beef patty, fresh lettuce, tomato, and cheese.',
      image: 'https://imgs.search.brave.com/OwdO_UwZNfdO1MJxLP_ps_kukiifacBVNVwDP-cp7G8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3Lzk2LzUxLzY2/LzM2MF9GXzc5NjUx/NjYyNF9YcHBTZWVr/bDk0YjJPRG5mMVlq/ZVFMcXIzYTNoZ3NY/VC5qcGc',
      category: 'fast food',
      sizes: [
        { id: 'regular', name: 'Regular', stock: 50, price: 150 },
        { id: 'large', name: 'Large', stock: 30, price: 200 },
        { id: 'meal', name: 'Meal', stock: 20, price: 250 },
      ],
    },
    {
      title: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice with no added sugar.',
      image: 'https://imgs.search.brave.com/M0aQ4sv5_dBp3RSOUmJoBdrNTj4LVRoqFK5we8lCm-M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAwLzc0LzE3LzMy/LzM2MF9GXzc0MTcz/Mjc3X3pKVjNJa3Rr/Slg4amZKNktOYm90/Wm1HWGdBa3cyWWVz/LmpwZw',
      category: 'beverages',
      sizes: [
        { id: 'small', name: 'Small (250ml)', stock: 100, price: 50 },
        { id: 'medium', name: 'Medium (500ml)', stock: 80, price: 80 },
        { id: 'large', name: 'Large (1L)', stock: 40, price: 120 },
      ],
    },
    {
      title: 'Pepperoni Pizza',
      description: 'Classic pizza topped with pepperoni and mozzarella cheese.',
      image: 'https://imgs.search.brave.com/HoMAn97nzDhLkmtgknMUOZf_oPFLzGy2R0agNb3ezZc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE2LzY4LzQx/LzM2MF9GXzIxNjY4/NDE4NV9Ub0ZGdUxu/ZnVmMHZBV1Aweklh/c1JXVUtkRUtqblNW/Ni5qcGc',
      category: 'pizza',
      sizes: [
        { id: 'small', name: 'Small (8")', stock: 30, price: 200 },
        { id: 'medium', name: 'Medium (10")', stock: 20, price: 300 },
        { id: 'large', name: 'Large (12")', stock: 15, price: 400 },
      ],
    },
    {
      title: 'Vegan Salad',
      description: 'A healthy mix of fresh greens, veggies, and a light dressing.',
      image: 'https://imgs.search.brave.com/2Q-H9yLZXuDP594iE6fmOgCbKl1k0upI99-1hQ8kZZE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by92/ZWdldGFibGVzLXNh/bGFkLXRhYmxlXzIz/LTIxNDg1MTU1MTUu/anBnP3NlbXQ9YWlz/X2h5YnJpZA',
      category: 'salads',
      sizes: [
        { id: 'small', name: 'Small', stock: 40, price: 120 },
        { id: 'regular', name: 'Regular', stock: 30, price: 150 },
        { id: 'large', name: 'Large', stock: 20, price: 200 },
      ],
    },
  ];
  