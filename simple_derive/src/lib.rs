use proc_macro::TokenStream;
use quote::quote;
use syn::{
    parse_macro_input, Data, DeriveInput, Field, Fields, GenericArgument, Ident, PathArguments,
    Type, TypePath,
};

#[proc_macro_derive(IntoValueKind)]
pub fn derive_into_value_kind(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let struct_name = &input.ident;

    let resolved = resolve_data(input.data);
    let expanded = quote! {
        impl From<#struct_name> for config::ValueKind {
            fn from(val: #struct_name) -> Self {
                let mut map: std::collections::HashMap<String, Value> = std::collections::HashMap::new();
                #resolved
                config::ValueKind::Table(map)
            }
        }
    };

    TokenStream::from(expanded)
}

fn resolve_data(input_data: Data) -> proc_macro2::TokenStream {
    match input_data {
        Data::Struct(data) => resolve_fields(data.fields),
        Data::Enum(_enum) => todo!(),
        Data::Union(_union) => todo!(),
    }
}

fn resolve_fields(fields: Fields) -> proc_macro2::TokenStream {
    match fields {
        Fields::Named(named_fields) => {
            let branches = named_fields.named.iter().map(resolve_field);
            quote! {
                #(#branches)*
            }
        }
        Fields::Unnamed(_) => todo!(),
        Fields::Unit => todo!(),
    }
}

fn resolve_field(field: &Field) -> proc_macro2::TokenStream {
    let field_name = field.ident.as_ref().unwrap();
    match &field.ty {
        Type::Array(_) => todo!(),
        Type::BareFn(_) => todo!(),
        Type::Group(_) => todo!(),
        Type::ImplTrait(_) => todo!(),
        Type::Infer(_) => todo!(),
        Type::Macro(_) => todo!(),
        Type::Never(_) => todo!(),
        Type::Paren(_) => todo!(),
        Type::Path(type_path) => resolve_type_path(type_path, field_name),
        Type::Ptr(_) => todo!(),
        Type::Reference(_) => todo!(),
        Type::Slice(_) => todo!(),
        Type::TraitObject(_) => todo!(),
        Type::Tuple(_) => todo!(),
        Type::Verbatim(_) => todo!(),
        _ => todo!(),
    }
}

fn resolve_type_path(type_path: &TypePath, field_name: &Ident) -> proc_macro2::TokenStream {
    let vec_ident = Ident::new("Vec", proc_macro2::Span::call_site());
    let path = &type_path.path;

    if path.is_ident("bool") {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::Boolean(val.#field_name).into()); }
    } else if path.is_ident("i8")
        || path.is_ident("i16")
        || path.is_ident("i32")
        || path.is_ident("i64")
    {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::I64(val.#field_name as i64).into()); }
    } else if path.is_ident("i128") {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::I128(val.#field_name).into()); }
    } else if path.is_ident("u8")
        || path.is_ident("u16")
        || path.is_ident("u32")
        || path.is_ident("u64")
    {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::U64(val.#field_name as u64).into()); }
    } else if path.is_ident("u128") {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::U128(val.#field_name).into()); }
    } else if path.is_ident("f32") || path.is_ident("f64") {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::F64(val.#field_name as f64).into()); }
    } else if path.is_ident("String") {
        quote! { map.insert(stringify!(#field_name).to_string(), config::ValueKind::String(val.#field_name).into()); }
    } else if path.segments.first().unwrap().ident == vec_ident {
        for segment in type_path.path.segments.iter() {
            resolve_path_arguments(&segment.arguments);
        }
        // TODO: implement this
        quote! {}
    } else {
        // may check the type of the field whether it's impl the From<ValueKind> trait
        quote! { map.insert(stringify!(#field_name).to_string(), val.#field_name.into()); }
    }
}

fn resolve_path_arguments(path_args: &PathArguments) -> proc_macro2::TokenStream {
    match path_args {
        PathArguments::AngleBracketed(ref args) => {
            println!("angle bracketed args: {:?}", args);
            for arg in args.args.iter() {
                resolve_generic_arguments(arg);
            }
            quote! {}
        }
        PathArguments::Parenthesized(ref args) => {
            println!("parenthesized args: {:?}", args);
            quote! {}
        }
        PathArguments::None => {
            println!("none type arg");
            quote! {}
        }
    }
}

fn resolve_generic_arguments(generic_args: &GenericArgument) -> proc_macro2::TokenStream {
    match generic_args {
        GenericArgument::Type(ty) => {
            println!("ty: {:?}", ty);
            quote! {}
        }
        GenericArgument::Lifetime(lt) => {
            println!("Lifetime: {:?}", lt);
            quote! {}
        }
        GenericArgument::Const(cst) => {
            println!("Const: {:?}", cst);
            quote! {}
        }
        GenericArgument::AssocType(at) => {
            println!("AssocType: {:?}", at);
            quote! {}
        }
        GenericArgument::AssocConst(ac) => {
            println!("AssocConst: {:?}", ac);
            quote! {}
        }
        GenericArgument::Constraint(ct) => {
            println!("Constraint: {:?}", ct);
            quote! {}
        }
        _ => {
            println!("never reach");
            quote! {}
        }
    }
}
