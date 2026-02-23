import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISearchIndex extends Document {
  productName: string;
  category: string;
  companyName: string;
  country: string;
  priceRange: string; // e.g., "100-500" or just storing min/max separately
  metadata: Record<string, any>;
}

const SearchIndexSchema: Schema = new Schema({
  productName: { type: String, index: true }, // Text index candidate
  category: { type: String, index: true },
  companyName: { type: String, index: true },
  country: { type: String, index: true },
  priceRange: { type: String },
  metadata: { type: Schema.Types.Mixed }
});

// Creating a text index for full-text search capabilities
SearchIndexSchema.index({ productName: 'text', category: 'text', companyName: 'text' });

const ProductSearchIndex: Model<ISearchIndex> = mongoose.models.ProductSearchIndex || mongoose.model<ISearchIndex>('ProductSearchIndex', SearchIndexSchema, 'product_search_index');

export default ProductSearchIndex;
