#[cfg(test)]
mod tests {
    use config::*;
    use simple_derive::IntoValueKind;
    use std::collections::HashMap;
    use std::convert::Into;

    #[derive(IntoValueKind, PartialEq, Debug)]
    struct Test {
        a: i32,
    }

    #[test]
    fn test_derive() {
        assert_eq!(
            Into::<ValueKind>::into(Test { a: 1 }),
            ValueKind::Table(HashMap::from(
                [("a".to_string(), ValueKind::I64(1).into()),]
            ))
        )
    }
}
